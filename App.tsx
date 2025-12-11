import React, { useState } from 'react';
import Login from './components/Login';
import Exam from './components/Exam';
import Results from './components/Results';
import { User, Answer, ExamResult, QuestionType, Question } from './types';
import { QUESTIONS, EXAM_TEXTS } from './data';
import { evaluateOpenAnswer, reformulateExam } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleLogin = async (userData: User) => {
    setIsGenerating(true);
    setUser(userData); 
    
    try {
      // 1. Select exactly ONE Reading Comprehension Text randomly from available texts
      const allTextIds = EXAM_TEXTS.map(t => t.id);
      let randomTextId = allTextIds[Math.floor(Math.random() * allTextIds.length)];
      
      // Get all questions related to this random text
      let readingQuestions = QUESTIONS.filter(q => q.textId === randomTextId);

      // FALLBACK: If selected text has no questions (safety check), default to Text 1
      if (readingQuestions.length === 0) {
          randomTextId = 1;
          readingQuestions = QUESTIONS.filter(q => q.textId === 1);
      }

      // 2. Select Independent Questions (Orthography, Grammar, etc.)
      const independentQuestionsPool = QUESTIONS.filter(q => 
        !q.textId || q.textId === 0
      );
      
      // Calculate how many we need to reach 30
      const totalQuestionsNeeded = 30;
      const slotsRemaining = totalQuestionsNeeded - readingQuestions.length;
      
      // Select random independent questions
      let selectedIndependent = shuffleArray(independentQuestionsPool);
      
      // If we don't have enough independent questions, duplicate some (though with the new data this is unlikely)
      while (selectedIndependent.length < slotsRemaining) {
         selectedIndependent = [...selectedIndependent, ...shuffleArray(independentQuestionsPool)];
      }
      
      const fillerQuestions = selectedIndependent.slice(0, slotsRemaining);

      // 3. Combine: Reading Section FIRST, then Independent Section
      const rawExam = [...readingQuestions, ...fillerQuestions];

      // 4. Reformulate with AI for uniqueness
      // PASS THE USER'S API KEY HERE
      const uniqueExam = await reformulateExam(rawExam, userData.fullName, userData.apiKey);
      
      setExamQuestions(uniqueExam);
    } catch (error) {
      console.error("Error preparing exam:", error);
      // Absolute Fallback: just shuffle everything and pick 30
      setExamQuestions(shuffleArray(QUESTIONS).slice(0, 30));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setUser(null);
    setExamQuestions([]);
    setExamResult(null);
    setIsSubmitting(false);
    setIsGenerating(false);
    setGradingProgress(0);
  };

  const gradeSingleQuestion = async (question: Question, answerValue: string) => {
    const safeResponse = {
        questionId: question.id,
        userAnswer: answerValue || '',
        isCorrect: false,
        pointsEarned: 0,
        maxPoints: question.points,
        aiAnalysis: undefined as any
    };

    try {
        if (question.type === QuestionType.MULTIPLE_CHOICE) {
            if (question.options && typeof question.correctOptionIndex === 'number') {
                const safeIndex = Math.min(Math.max(0, question.correctOptionIndex), question.options.length - 1);
                const correctText = question.options[safeIndex];
                
                if (correctText && answerValue && answerValue.trim().toLowerCase() === correctText.trim().toLowerCase()) {
                    safeResponse.pointsEarned = question.points;
                    safeResponse.isCorrect = true;
                }
            }
        } else {
            const contextText = EXAM_TEXTS.find(t => t.id === question.textId);
            
            // Increased timeout to 45 seconds to account for retries
            const timeoutPromise = new Promise<any>((resolve) => {
                setTimeout(() => resolve({ score: 0, feedback: "Tiempo de espera IA agotado. Revise su conexión o intente más tarde." }), 45000);
            });

            // PASS USER API KEY HERE
            const result = await Promise.race([
                evaluateOpenAnswer(question, answerValue, contextText, user?.apiKey),
                timeoutPromise
            ]);
            
            safeResponse.aiAnalysis = result;
            safeResponse.pointsEarned = result.score;
            
            if (safeResponse.pointsEarned > question.points) safeResponse.pointsEarned = question.points;
            if (safeResponse.pointsEarned < 0) safeResponse.pointsEarned = 0;
        }

        return safeResponse;
    } catch (e) {
        console.error("Grade error:", e);
        safeResponse.aiAnalysis = { questionId: question.id, score: 0, feedback: "Error interno de evaluación." };
        return safeResponse;
    }
  };

  const handleExamSubmit = async (answers: Answer[]) => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    setGradingProgress(0);
    
    const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);
    const allDetails: any[] = [];
    
    try {
      // Reduced Batch Size to prevent Rate Limits (429)
      const BATCH_SIZE = 2;
      
      for (let i = 0; i < examQuestions.length; i += BATCH_SIZE) {
         const batch = examQuestions.slice(i, i + BATCH_SIZE);
         
         const batchResults = await Promise.all(batch.map(q => {
             const ans = answers.find(a => a.questionId === q.id)?.value || '';
             return gradeSingleQuestion(q, ans);
         }));

         allDetails.push(...batchResults);
         
         const newProgress = Math.round(((i + batch.length) / examQuestions.length) * 100);
         setGradingProgress(Math.min(newProgress, 99)); 
         
         // Increased delay between batches to 1.5 seconds
         await new Promise(r => setTimeout(r, 1500));
      }

      const totalScore = allDetails.reduce((sum, detail) => sum + detail.pointsEarned, 0);

      setExamResult({
        totalScore,
        maxScore,
        details: allDetails
      });

    } catch (error) {
      console.error("Critical Grading Error:", error);
      const fallbackDetails = examQuestions.map(q => ({
          questionId: q.id,
          userAnswer: answers.find(a => a.questionId === q.id)?.value || '',
          isCorrect: false,
          pointsEarned: 0,
          maxPoints: q.points,
          aiAnalysis: { score: 0, feedback: "Error crítico durante la evaluación masiva." }
      }));

      setExamResult({
        totalScore: 0,
        maxScore: maxScore,
        details: fallbackDetails
      });
    } finally {
      setIsSubmitting(false);
      setGradingProgress(100);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center max-w-md w-full text-center">
          <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Generando Examen Único</h2>
          <p className="text-gray-500 text-sm">Preparando 30 preguntas personalizadas para {user.fullName}...</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center max-w-md w-full text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-indigo-600 animate-spin mb-4" />
            <div className="absolute inset-0 flex items-center justify-center mb-4 text-xs font-bold text-indigo-800">
               {gradingProgress}%
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Evaluando Respuestas</h2>
          <p className="text-gray-500 text-sm mb-4">
            Analizando cada respuesta con IA. <br/> Por favor, no cierres la página.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
             <div 
               className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out" 
               style={{ width: `${gradingProgress}%` }}
             ></div>
          </div>
        </div>
      </div>
     );
  }

  if (examResult) {
    return <Results result={examResult} user={user} onRestart={handleRestart} />;
  }

  return (
    <Exam 
      user={user} 
      questions={examQuestions} 
      onSubmit={handleExamSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default App;