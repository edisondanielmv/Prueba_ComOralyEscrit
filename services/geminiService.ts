import { GoogleGenAI } from "@google/genai";
import { Question, AIAnalysis, TextContext, QuestionType } from '../types';

let apiKey = '';
try {
  // Safely attempt to access process.env.API_KEY
  apiKey = process.env.API_KEY || '';
} catch (e) {
  console.warn("process.env is not defined, running without explicit key variable check.");
}

const ai = new GoogleGenAI({ apiKey });

// Helper to strictly extract JSON from AI response (Object or Array)
const cleanJsonString = (str: string) => {
  if (!str) return '[]';
  
  // Remove markdown code blocks first
  let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();

  // Find the first occurrence of '{' or '['
  const firstOpenBrace = clean.indexOf('{');
  const firstOpenBracket = clean.indexOf('[');
  
  let start = -1;
  let end = -1;

  // Determine if it looks like an Object or an Array based on what comes first
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
  
  // Fallback: return the stripped string
  return clean;
};

export const evaluateOpenAnswer = async (
  question: Question, 
  userAnswer: string,
  contextText?: TextContext
): Promise<AIAnalysis> => {
  
  // Fast fail for empty answers
  if (!userAnswer || userAnswer.trim().length < 3) {
    return {
      questionId: question.id,
      score: 0,
      feedback: "No se proporcionó una respuesta adecuada para evaluar."
    };
  }

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
    
    Retorna ESTRICTAMENTE este formato JSON (sin markdown, sin texto extra):
    {
      "score": (número),
      "feedback": "(texto breve)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json" 
      }
    });

    const rawText = response.text || '{}';
    const cleanedText = cleanJsonString(rawText);
    
    let result;
    try {
        result = JSON.parse(cleanedText);
    } catch (e) {
        console.warn("JSON Parse failed for evaluation", rawText);
        // Fallback regex for score extraction
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

  } catch (error) {
    console.error("Gemini Grading Error:", error);
    return {
      questionId: question.id,
      score: 0,
      feedback: "Error de conexión con IA. Se asignó 0 por defecto."
    };
  }
};

export const reformulateExam = async (
  questions: Question[], 
  studentName: string
): Promise<Question[]> => {
  const model = "gemini-2.5-flash";

  // Simplify to save tokens
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
       - SI CAMBIAS EL ORDEN, DEBES ACTUALIZAR 'correctOptionIndex' para que apunte a la respuesta correcta.
    4. El idioma debe ser ESPAÑOL FORMAL.
    
    Responde SOLO con el JSON Array válido.
    ${JSON.stringify(simplifiedQuestions)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const rawText = response.text || '[]';
    const cleanedText = cleanJsonString(rawText);
    
    let newQuestionsData;
    try {
        newQuestionsData = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse reformulation JSON", e);
        return questions; // Fallback to original if parse fails
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
    console.error("Error generating exam:", error);
    return questions;
  }
};