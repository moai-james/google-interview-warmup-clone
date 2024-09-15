import fs from 'fs';
import path from 'path';

export interface Question {
  question_id: number;
  category: string;
  type: string;
  evaluation_point: string;
  field: string;
  question: string;
  question_zh: string; // Added question_zh field
  voice_file_en: string;
  voice_file_zh: string;
}

export function getRandomQuestions(questions: Question[], count: number): Question[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function parseQuestions(fileContents: string): Question[] {
  return JSON.parse(fileContents);
}
