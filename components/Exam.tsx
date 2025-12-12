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
  // Configurado a 60 minutos (3600 segundos)
  const [timeLeft, setTimeLeft] = useState(3600); 
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
  const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

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
               className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md shadow transition-all flex items-center gap-2"
             >
               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
               <span className="hidden sm:inline">Finalizar</span>
               <span className="sm:hidden">Fin</span>
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Progress Bar */}
      <div className="bg-gray-200 h-1 flex sm:hidden w-full relative z-20">
         <div className={`h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{width: `${(timeLeft/3600)*100}%`}} />
      </div>

      <div className="flex flex-1 overflow-hidden relative max-w-[1920px] mx-auto w-full">
        
        {/* SIDEBAR */}
        <div className={`
           fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 shadow-xl lg:shadow-none
           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
           <div className="h-full flex flex-col">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                 <span className="font-semibold text-gray-700 text-sm">Navegador ({progress}%)</span>
                 <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500"><X className="w-4 h-4"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 prose-scroll">
                 <div className="grid grid-cols-4 gap-2">
                    {questions.map((q, idx) => {
                        const isAnswered = !!answers[q.id];
                        const isCurrent = idx === currentQuestionIndex;
                        const hasText = !!q.textId && q.textId !== 0;
                        return (
                            <button
                            key={q.id}
                            onClick={() => {
                                setCurrentQuestionIndex(idx);
                                setSidebarOpen(false);
                            }}
                            className={`
                                h-9 rounded text-xs font-semibold transition-all flex items-center justify-center relative border
                                ${isCurrent 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                    : isAnswered 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }
                            `}
                            >
                            {idx + 1}
                            {hasText && (
                              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            )}
                            </button>
                        );
                    })}
                 </div>
                 
                 <div className="mt-8 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-3 h-3 bg-indigo-600 rounded"></div> Actual
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded"></div> Respondida
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div> Pendiente
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col lg:flex-row relative bg-white overflow-hidden">
           
           {isReadingSection && (
               <div className="lg:w-1/2 h-2/5 lg:h-full bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto p-6 lg:p-10 shadow-inner prose-scroll">
                  <article className="prose prose-sm lg:prose-base max-w-none text-gray-700 font-serif leading-relaxed">
                     <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10">
                        <BookOpen className="w-4 h-4 text-gray-500"/>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recurso de Lectura</span>
                     </div>
                     {currentTextObj && (
                       <div className="animate-in fade-in duration-500">
                         <h3 className="text-xl font-bold text-gray-900 mb-4">{currentTextObj.title}</h3>
                         <div className="whitespace-pre-line text-justify text-base">
                           {currentTextObj.content}
                         </div>
                       </div>
                     )}
                  </article>
               </div>
           )}

           <div className={`
             flex flex-col bg-white transition-all duration-300 overflow-hidden
             ${isReadingSection ? 'lg:w-1/2 h-3/5 lg:h-full' : 'w-full h-full'}
           `}>
             <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 flex flex-col items-center prose-scroll">
               {currentQuestion && (
                 <div className={`w-full ${isReadingSection ? '' : 'max-w-3xl'} animate-in slide-in-from-right-4 duration-300 pb-20`}>
                    
                    {!isReadingSection && (
                        <div className="mb-8 text-center">
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Evaluación de Conocimiento General
                            </span>
                        </div>
                    )}
                    
                    <QuestionCard
                        question={currentQuestion}
                        currentAnswer={answers[currentQuestion.id] || ''}
                        onAnswerChange={handleAnswerChange}
                        questionIndex={currentQuestionIndex}
                        totalQuestions={questions.length}
                    />
                 </div>
               )}
             </div>

             <div className="bg-white p-4 border-t border-gray-100 flex justify-between items-center z-20 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button
                 onClick={prevQuestion}
                 disabled={currentQuestionIndex === 0}
                 className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
               >
                 <ChevronLeft className="w-4 h-4 mr-1"/> Anterior
               </button>
               
               <div className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
                  Pregunta {currentQuestionIndex + 1} / {questions.length}
               </div>

               <button
                 onClick={nextQuestion}
                 disabled={currentQuestionIndex === questions.length - 1}
                 className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm disabled:opacity-40 disabled:bg-gray-400 disabled:shadow-none transition-all text-sm"
               >
                 Siguiente <ChevronRight className="w-4 h-4 ml-1"/>
               </button>
             </div>
           </div>
       </div>

      </div>
    </div>
  );
};

export default Exam;