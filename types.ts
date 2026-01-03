
export enum Difficulty {
  EASY = 'Mudah',
  MEDIUM = 'Sedang',
  HARD = 'Sulit'
}

export enum Category {
  ADDITION = 'Penjumlahan',
  SUBTRACTION = 'Pengurangan',
  MULTIPLICATION = 'Perkalian',
  DIVISION = 'Pembagian',
  GEOMETRY = 'Geometri',
  LOGIC = 'Logika'
}

export interface MathProblem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export interface UserStats {
  points: number;
  level: number;
  completedProblems: number;
  badges: string[];
}
