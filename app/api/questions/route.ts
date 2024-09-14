import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseQuestions, getRandomQuestions, Question } from '@/utils/questionParser';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const position = searchParams.get('position');
  const count = parseInt(searchParams.get('count') || '5', 10);

  if (!position) {
    return NextResponse.json({ error: 'Position is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'data', 'questions', `${position.toLowerCase().replace(/ /g, '_')}.json`);
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const allQuestions = parseQuestions(fileContents);
    const selectedQuestions = getRandomQuestions(allQuestions, count);
    return NextResponse.json(selectedQuestions);
  } catch (error) {
    console.error('Error reading or parsing questions file:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
