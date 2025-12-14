import React, { useState, useEffect } from 'react';
import { User, Question, Answer } from '../types';
import QuestionCard from './QuestionCard';
import { EXAM_TEXTS } from '../data';
import { Loader2, ChevronLeft, ChevronRight, Menu, X, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface ExamProps {
  user: User;
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
  isSubmitting: boolean;
}

const Exam: React.FC<ExamProps> = ({ user, questions, onSubmit, isSubmitting }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Configurado a 120 minutos (7200 segundos)
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Lógica del Temporizador
  useEffect(() => {
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Si el tiempo llega a 0, enviamos inmediatamente
          submitExamNow(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;
  
  const isReadingSection = !!currentQuestion?.textId && currentQuestion.textId !== 0;
  
  const currentTextObj = isReadingSection 
    ? EXAM_TEXTS.find(t => t.id === currentQuestion!.textId) 
    : null;

  const handleAnswerChange = (val: string) => {
    if (currentQuestion) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    }
  };

  const submitExamNow = () => {
    // Recopilamos todas las respuestas. Si una pregunta no tiene respuesta (undefined), enviamos cadena vacía.
    const formattedAnswers: Answer[] = questions.map(q => ({
      questionId: q.id,
      value: answers[q.id] || '' 
    }));
    setShowFinishModal(false);
    onSubmit(formattedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  
  if (!questions || questions.length === 0) {
      return (
          <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-gray-600">Cargando preguntas...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden relative text-gray-800">
      
      {/* Modal de confirmación manual */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">¿Terminar Evaluación?</h2>
              <p className="text-gray-600 text-sm mb-6">
                Has respondido <strong className="text-indigo-600">{answeredCount}</strong> de <strong className="text-gray-800">{totalCount}</strong> preguntas.
                {answeredCount < totalCount && (
                  <span className="block mt-2 text-red-500 font-medium">
                    Las preguntas sin responder ({totalCount - answeredCount}) se calificarán con 0.
                  </span>
                )}
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                >
                  Volver
                </button>
                <button 
                  onClick={submitExamNow}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 z-30 h-16 flex-shrink-0 shadow-sm">
        <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
                <Menu className="w-5 h-5" />
             </button>
             <h1 className="text-base lg:text-lg font-bold text-gray-800 tracking-tight hidden sm:block">Evaluación de Competencias</h1>
             <h1 className="text-base font-bold text-gray-800 tracking-tight sm:hidden">Evaluación</h1>
          </div>

          <div className="flex items-center gap-4">
             {/* TIMER */}
             <div className={`flex items-center gap-2 px-3 py-1 rounded border shadow-sm ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white border-gray-200 text-gray-600'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm font-semibold">{formatTime(timeLeft)}</span>
             </div>

             <button
               type="button"
               onClick={() => setShowFinishModal(true)}
               disabled={isSubmitting}
               className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
             >
               Finalizar
             </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* SIDEBAR NAVIGATION (Desktop: Static | Mobile: Absolute/Overlay) */}
        <aside className={`
            absolute lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-20 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <span className="text-sm font-bold text-gray-500 uppercase">Navegación</span>
               <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2 prose-scroll">
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          setSidebarOpen(false);
                        }}
                        className={`
                          h-10 rounded-lg text-xs font-bold transition-all border
                          ${isCurrent 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200' 
                              : isAnswered 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}
                        `}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
             </div>

             <div className="p-4 border-t border-gray-200 bg-gray-50">
               <div className="flex justify-between text-xs text-gray-500 mb-2">
                 <span>Progreso</span>
                 <span>{Math.round((answeredCount / totalCount) * 100)}%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div 
                   className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                   style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                 ></div>
               </div>
             </div>
          </div>
        </aside>

        {/* OVERLAY for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/20 z-10 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-gray-50 prose-scroll relative">
          <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-full flex flex-col">
            
            {/* Split View for Reading Comprehension */}
            {isReadingSection && currentTextObj && (
              <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-800 text-white px-6 py-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold text-sm tracking-wide">Lectura de Comprensión</span>
                </div>
                <div className="p-6 md:p-8 max-h-[40vh] overflow-y-auto prose-scroll bg-slate-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">{currentTextObj.title}</h3>
                  <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed font-serif whitespace-pre-line">
                    {currentTextObj.content}
                  </div>
                </div>
              </div>
            )}

            {/* Question Card */}
            {currentQuestion && (
                <div className="flex-1">
                    <QuestionCard
                        question={currentQuestion}
                        currentAnswer={answers[currentQuestion.id] || ''}
                        onAnswerChange={handleAnswerChange}
                        questionIndex={currentQuestionIndex}
                        totalQuestions={questions.length}
                    />
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
               <button
                 onClick={prevQuestion}
                 disabled={currentQuestionIndex === 0}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors
                   ${currentQuestionIndex === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-white hover:shadow-sm bg-gray-100 border border-transparent hover:border-gray-200'}`}
               >
                 <ChevronLeft className="w-5 h-5" />
                 Anterior
               </button>

               {currentQuestionIndex < questions.length - 1 ? (
                 <button
                   onClick={nextQuestion}
                   className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all transform active:scale-95"
                 >
                   Siguiente
                   <ChevronRight className="w-5 h-5" />
                 </button>
               ) : (
                 <button
                    onClick={() => setShowFinishModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5"
                 >
                    Finalizar Evaluación
                 </button>
               )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exam;