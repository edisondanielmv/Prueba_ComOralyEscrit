import { GoogleGenAI } from "@google/genai";
import { Question, AIAnalysis, TextContext, QuestionType } from '../types';

// Helper to get client with dynamic key or fallback to env
const getClient = (customKey?: string) => {
    let key = customKey;
    if (!key) {
        try {
            key = process.env.API_KEY || '';
        } catch (e) {
            console.warn("process.env access failed");
        }
    }
    return new GoogleGenAI({ apiKey: key || '' });
};

// Helper to strictly extract JSON from AI response
const cleanJsonString = (str: string) => {
  if (!str) return '[]';
  
  let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();

  const firstOpenBrace = clean.indexOf('{');
  const firstOpenBracket = clean.indexOf('[');
  
  let start = -1;
  let end = -1;

  if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
      start = firstOpenBrace;
      end = clean.lastIndexOf('}');
  } else if (firstOpenBracket !== -1) {
      start = firstOpenBracket;
      end = clean.lastIndexOf(']');
  }

  if (start !== -1 && end !== -1 && end > start) {
    return clean.substring(start, end + 1);
  }
  
  return clean;
};

// Retry helper for API calls
async function generateWithRetry(ai: GoogleGenAI, model: string, prompt: string, retries = 3, delay = 2000): Promise<any> {
    try {
        return await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
    } catch (error: any) {
        if (retries > 0) {
            console.warn(`Gemini API request failed. Retrying in ${delay}ms... (${retries} attempts left). Error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateWithRetry(ai, model, prompt, retries - 1, delay * 2);
        }
        throw error;
    }
}

/**
 * Checks if the provided API Key (or system default) works.
 */
export const checkSystemAvailability = async (userApiKey?: string): Promise<boolean> => {
    const ai = getClient(userApiKey);
    
    // Check if we actually have a key to test
    let currentKey = userApiKey;
    if (!currentKey) {
        try { currentKey = process.env.API_KEY; } catch(e) {}
    }
    if (!currentKey) return false;

    try {
        await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "ping",
        });
        return true;
    } catch (error) {
        console.error("System Check Failed:", error);
        return false;
    }
};

export const evaluateOpenAnswer = async (
  question: Question, 
  userAnswer: string,
  contextText?: TextContext,
  userApiKey?: string
): Promise<AIAnalysis> => {
  
  if (!userAnswer || userAnswer.trim().length < 3) {
    return {
      questionId: question.id,
      score: 0,
      feedback: "No se proporcionó una respuesta adecuada para evaluar."
    };
  }

  const ai = getClient(userApiKey);
  const model = "gemini-2.5-flash";

  const prompt = `
    Eres un evaluador académico estricto pero justo. Tu ÚNICA tarea es devolver un JSON.
    
    Contexto: "${contextText ? contextText.content.substring(0, 1000) + '...' : 'Sin contexto específico de lectura'}"
    Pregunta: "${question.questionText}"
    Respuesta Correcta Esperada: "${question.expectedAnswer}"
    Puntos Posibles: ${question.points}
    Respuesta del Estudiante: "${userAnswer}"
    
    Instrucciones:
    1. Analiza la respuesta del estudiante comparándola con la esperada.
    2. Asigna un puntaje preciso (puede ser decimal, ej: 1.5).
    3. Provee retroalimentación breve justificando la nota.
    
    Retorna ESTRICTAMENTE este formato JSON:
    {
      "score": (número),
      "feedback": "(texto breve)"
    }
  `;

  try {
    const response = await generateWithRetry(ai, model, prompt);
    const rawText = response.text || '{}';
    const cleanedText = cleanJsonString(rawText);
    
    let result;
    try {
        result = JSON.parse(cleanedText);
    } catch (e) {
        console.warn("JSON Parse failed for evaluation", rawText);
        const scoreMatch = rawText.match(/"score":\s*([\d.]+)/);
        result = {
            score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
            feedback: "Evaluación manual requerida (Error de formato IA)."
        };
    }
    
    return {
      questionId: question.id,
      score: typeof result.score === 'number' ? result.score : 0,
      feedback: result.feedback || "Sin comentarios generados."
    };

  } catch (error: any) {
    console.error("Gemini Grading Error Final:", error);
    
    let feedbackMsg = "Error de conexión con IA. Se asignó 0 por defecto.";
    if (error.message && error.message.includes('429')) {
        feedbackMsg = "Error: Sistema saturado (Rate Limit). Intente nuevamente.";
    } else if (error.message && (error.message.includes('400') || error.message.includes('403'))) {
        feedbackMsg = "Error: Problema de permisos o API Key inválida.";
    }

    return {
      questionId: question.id,
      score: 0,
      feedback: feedbackMsg
    };
  }
};

export const reformulateExam = async (
  questions: Question[], 
  studentName: string,
  userApiKey?: string
): Promise<Question[]> => {
  const ai = getClient(userApiKey);
  const model = "gemini-2.5-flash";
  
  // Check if we have a key (either custom or env)
  let activeKey = userApiKey;
  if (!activeKey) {
     try { activeKey = process.env.API_KEY; } catch(e) {}
  }
  if (!activeKey) return questions;

  const simplifiedQuestions = questions.map(q => ({
    id: q.id,
    type: q.type,
    text: q.questionText,
    options: q.options || [],
    correctIndex: q.correctOptionIndex,
    expected: q.expectedAnswer
  }));

  const prompt = `
    Eres un profesor experto. Reformula este examen para el estudiante: ${studentName}.
    Entrada: Lista de preguntas.
    Salida: JSON Array ([...]) con preguntas modificadas.
    
    Instrucciones:
    1. Mantén estrictamente los IDs originales.
    2. Cambia la redacción de 'questionText' para que sea única pero evalúe lo mismo.
    3. Para preguntas de OPCIÓN MÚLTIPLE: 
       - Puedes cambiar el orden de las opciones.
       - SI CAMBIAS EL ORDEN, DEBES ACTUALIZAR 'correctOptionIndex'.
    4. El idioma debe ser ESPAÑOL FORMAL.
    
    Responde SOLO con el JSON Array válido.
    ${JSON.stringify(simplifiedQuestions)}
  `;

  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000));
    
    const response: any = await Promise.race([
        ai.models.generateContent({
            model: model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }),
        timeoutPromise
    ]);

    const rawText = response.text || '[]';
    const cleanedText = cleanJsonString(rawText);
    
    let newQuestionsData;
    try {
        newQuestionsData = JSON.parse(cleanedText);
    } catch (e) {
        return questions; 
    }
    
    if (!Array.isArray(newQuestionsData)) {
        return questions;
    }

    const finalQuestions: Question[] = questions.map(original => {
      const reformulated = newQuestionsData.find((n: any) => n.id === original.id);
        
      if (reformulated) {
        return {
          ...original,
          questionText: reformulated.questionText || original.questionText,
          options: original.type === QuestionType.MULTIPLE_CHOICE ? (reformulated.options || original.options) : undefined,
          correctOptionIndex: original.type === QuestionType.MULTIPLE_CHOICE ? (reformulated.correctOptionIndex ?? original.correctOptionIndex) : undefined,
          expectedAnswer: original.type === QuestionType.OPEN_TEXT ? (reformulated.expectedAnswer || original.expectedAnswer) : original.expectedAnswer
        };
      }
      return original;
    });

    return finalQuestions;

  } catch (error) {
    console.warn("Skipping exam reformulation due to API load:", error);
    return questions;
  }
};