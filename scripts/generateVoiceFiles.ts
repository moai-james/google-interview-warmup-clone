import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FISH_AUDIO_API_KEY = process.env.FISH_AUDIO_API_KEY;
const FISH_AUDIO_API_URL = 'https://api.fish.audio/v1/tts';

if (!FISH_AUDIO_API_KEY) {
  console.error('FISH_AUDIO_API_KEY is not set in the environment variables');
  process.exit(1);
}

async function generateVoiceFile(text: string, language: string): Promise<Buffer> {
  const options = {
    method: 'POST',
    url: FISH_AUDIO_API_URL,
    headers: {
      'Authorization': `Bearer ${FISH_AUDIO_API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      text: text,
      voice_id: language === 'en' ? 'en-US-1' : 'zh-CN-1', // Adjust voice IDs as needed
      chunk_length: 200,
      normalize: true,
      format: 'mp3',
      mp3_bitrate: 64,
      opus_bitrate: -1000,
      latency: 'normal'
    }),
    responseType: 'arraybuffer'
  };

  try {
    const response = await axios(options);
    return Buffer.from(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        headers: error.response.headers,
        data: Buffer.from(error.response.data).toString('utf-8')
      });
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error;
  }
}

async function processQuestionFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const questions: Question[] = JSON.parse(fileContent);
  const jobPosition = path.basename(filePath, '.json');

  for (const question of questions) {
    // Generate English voice file
    const englishVoiceBuffer = await generateVoiceFile(question.question, 'en');
    const englishFilePath = path.join('public', 'voice_files', `en_${jobPosition}_${question.question_id}.mp3`);
    fs.writeFileSync(englishFilePath, englishVoiceBuffer);
    question.voice_file_en = `/voice_files/en_${jobPosition}_${question.question_id}.mp3`;

    // Generate Chinese voice file
    const chineseVoiceBuffer = await generateVoiceFile(question.question_zh, 'zh');
    const chineseFilePath = path.join('public', 'voice_files', `zh_${jobPosition}_${question.question_id}.mp3`);
    fs.writeFileSync(chineseFilePath, chineseVoiceBuffer);
    question.voice_file_zh = `/voice_files/zh_${jobPosition}_${question.question_id}.mp3`;
  }

  // Write updated questions back to the file
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
}

async function main() {
  const questionsDir = path.join(process.cwd(), 'data', 'questions');
  const files = fs.readdirSync(questionsDir);

  for (const file of files) {
    if (file.endsWith('.json')) {
      await processQuestionFile(path.join(questionsDir, file));
    }
  }
}

main().catch(console.error);