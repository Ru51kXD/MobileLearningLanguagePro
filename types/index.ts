export interface User {
  id: number;
  name: string;
  email: string;
  level: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  streak: number;
  points: number;
  joinedDate: string;
}

export interface Language {
  id: number;
  name: string;
  description: string;
  lessons: number;
  difficulty: 'Начинающий' | 'Средний' | 'Сложный';
  color: string[];
  icon: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: number;
  difficulty: 'Начинающий' | 'Средний' | 'Сложный';
  color: string[];
  icon: string;
  questions_data: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  completed: boolean;
}

export interface LearningStats {
  title: string;
  completed: number;
  total: number | null;
  color: string;
  icon: string;
}

export interface MenuItem {
  icon: string;
  title: string;
  subtitle: string;
}
