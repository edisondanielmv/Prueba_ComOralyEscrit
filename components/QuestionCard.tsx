import React from 'react';
import { Question, QuestionType } from '../types';

interface QuestionCardProps {
  question: Question;
  currentAnswer: string;
  onAnswerChange: (val: string) => void;
  questionIndex: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  questionIndex,
  totalQuestions
}) => {
  return (
    <div className="w-full mx-auto">
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed mb-3">
          {question.questionText}
        </h2>
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                {question.type === QuestionType.MULTIPLE_CHOICE ? 'Selección Múltiple' : 'Respuesta Abierta'}
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                {question.points} {question.points === 1 ? 'punto' : 'puntos'}
            </span>
        </div>
      </div>

      {/* Answer Area */}
      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
        {question.type === QuestionType.MULTIPLE_CHOICE && question.options ? (
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = currentAnswer === option;
              return (
                <label 
                  key={idx} 
                  className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-base text-gray-700 leading-snug">
                    {option}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="relative">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white placeholder-gray-400 text-base leading-relaxed min-h-[150px] resize-y"
              placeholder="Escribe tu respuesta aquí..."
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <span className={`text-xs font-medium ${currentAnswer.length > 20 ? 'text-green-600' : 'text-gray-400'}`}>
                {currentAnswer.length} caracteres
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;