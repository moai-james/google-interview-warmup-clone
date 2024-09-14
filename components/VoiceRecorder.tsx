'use client'

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
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
          <Square className="mr-2 h-4 w-4" /> Stop Recording
        </Button>
      ) : (
        <Button onClick={startRecording} disabled={isTranscribing}>
          <Mic className="mr-2 h-4 w-4" /> {isTranscribing ? 'Transcribing...' : 'Start Recording'}
        </Button>
      )}
    </div>
  );
};

export default VoiceRecorder;
