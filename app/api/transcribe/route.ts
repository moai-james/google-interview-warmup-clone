import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert WebM to MP3 (OpenAI supports MP3)
    const buffer = Buffer.from(await file.arrayBuffer());
    const mp3Buffer = await convertWebmToMp3(buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: new File([mp3Buffer], 'audio.mp3', { type: 'audio/mpeg' }),
      model: 'whisper-1',
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (error) {
    console.error('Error in transcription:', error);
    return NextResponse.json({ error: 'An error occurred during transcription' }, { status: 500 });
  }
}

async function convertWebmToMp3(webmBuffer: Buffer): Promise<Buffer> {
  // Implement WebM to MP3 conversion here
  // You might need to use a library like ffmpeg.wasm for this conversion
  // For now, we'll just return the original buffer
  return webmBuffer;
}
