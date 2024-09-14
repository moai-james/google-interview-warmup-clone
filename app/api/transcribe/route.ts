import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert WebM to MP3 (OpenAI supports MP3)
    const buffer = Buffer.from(await file.arrayBuffer());

    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], 'audio.mp3', { type: 'audio/mpeg' }),
      model: 'whisper-1',
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (error) {
    console.error('Error in transcription:', error);
    return NextResponse.json({ error: 'An error occurred during transcription' }, { status: 500 });
  }
}
