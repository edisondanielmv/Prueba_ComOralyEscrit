export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  OPEN_TEXT = 'OPEN_TEXT'
}

export interface TextContext {
  id: number;
  title: string;
  content: string;
}

export interface Question {
  id: number;
  textId?: number; // Reference to TextContext id
  questionText: string;
  type: QuestionType;
  options?: string[]; // For Multiple Choice
  correctOptionIndex?: number; // For Multiple Choice (0-3)
  expectedAnswer?: string; // For Open Text (Rubric for AI)
  points: number;
}

export interface User {
  fullName: string;
  cedula: string;
  apiKey?: string; // Optional custom API key
}

export interface Answer {
  questionId: number;
  value: string; // The user's input or selected option
}

export interface AIAnalysis {
  questionId: number;
  score: number; // 0 to points
  feedback: string;
}

export interface ExamResult {
  totalScore: number;
  maxScore: number;
  details: {
    questionId: number;
    userAnswer: string;
    isCorrect?: boolean; // For MC
    aiAnalysis?: AIAnalysis; // For Open
    pointsEarned: number;
    maxPoints: number;
  }[];
}