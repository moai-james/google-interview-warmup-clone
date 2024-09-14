'use client'

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleStop;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { transcription } = await response.json();
        onTranscriptionComplete(transcription);
      } else {
        console.error('Transcription failed');
      }
    } catch (error) {
      console.error('Error during transcription:', error);
    }

    setIsTranscribing(false);
  };

  return (
    <div>
      {isRecording ? (
        <Button onClick={stopRecording} variant="destructive">
          <Square className="mr-2 h-4 w-4" /> {language === 'en' ? 'Stop Recording' : '停止錄音'}
        </Button>
      ) : (
        <Button onClick={startRecording} disabled={isTranscribing}>
          <Mic className="mr-2 h-4 w-4" /> {isTranscribing ? (language === 'en' ? 'Transcribing...' : '轉錄中...') : (language === 'en' ? 'Start Recording' : '開始錄音')}
        </Button>
      )}
    </div>
  );
};

export default VoiceRecorder;
