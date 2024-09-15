'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Keyboard, ArrowRight, Volume2, MoreVertical, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { parseQuestions, getRandomQuestions } from '@/utils/questionParser';
import { Question } from '@/utils/questionParser';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), { ssr: false });



export function InterviewWarmupComponent() {
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [volumeOn, setVolumeOn] = useState(true);
  const totalQuestions = 5;
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>(Array(totalQuestions).fill(''));
  const [questions, setQuestions] = useState<{ question: string; question_zh: string; type: string; voice_file_en?: string; voice_file_zh?: string }[]>([]);
  const { language, setLanguage } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioSrc = language === 'en' ? questions[currentStep]?.voice_file_en : questions[currentStep]?.voice_file_zh;
    console.log('Audio source:', audioSrc);
  }, [currentStep, language, questions]);

  const handleStart = () => {
    setCurrentPage('position');
  };

  const positions = [
    { key: 'trust_operations_personnel', label: language === 'en' ? "Trust Operations Personnel" : "信託人員" },
    { key: 'general', label: language === 'en' ? "General" : "一般性" },
  ];

  const handlePositionSelect = async (positionKey: string) => {
    const position = positions.find(p => p.key === positionKey)?.label;
    if (!position) return;

    setSelectedPosition(position);
    try {
      const response = await fetch(`/api/questions?position=${encodeURIComponent(positionKey)}&count=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const selectedQuestions: Question[] = await response.json();
      setQuestions(selectedQuestions.map(q => ({ question: q.question, question_zh: q.question_zh, type: q.type, voice_file_en: q.voice_file_en, voice_file_zh: q.voice_file_zh })));
      setCurrentPage('intro');
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const handleStartPractice = () => {
    setCurrentPage('interview');
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = currentAnswer;
    setAnswers(newAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer(answers[currentStep + 1]);
    } else {
      setCurrentPage('analysis');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newAnswers = [...answers];
      newAnswers[currentStep] = currentAnswer;
      setAnswers(newAnswers);
      setCurrentStep(currentStep - 1);
      setCurrentAnswer(answers[currentStep - 1]);
    } else {
      setCurrentPage('intro');
    }
  };

  const handlePracticeAgain = () => {
    setCurrentStep(0);
    setCurrentPage('main');
    setSelectedPosition('');
    setAnswers(Array(totalQuestions).fill(''));
    setCurrentAnswer('');
  };

  const handlePreviousStep = () => {
    switch (currentPage) {
      case 'position':
        setCurrentPage('main');
        break;
      case 'intro':
        setCurrentPage('position');
        break;
      case 'interview':
        handlePrevious();
        break;
      case 'analysis':
        setCurrentPage('interview');
        setCurrentStep(totalQuestions - 1);
        break;
      default:
        break;
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          // Optionally, show an error message to the user
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderHeader = () => (
    <header className="flex items-center justify-between p-4 bg-white border-b relative">
      <Button variant="ghost" size="icon" onClick={handlePreviousStep} className="absolute left-4">
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-semibold flex-grow text-center">
        {language === 'en' ? 'Interview warmup' : '面試熱身'}
      </h1>
      <div className="flex items-center space-x-2 absolute right-4">
        <LanguageSwitcher />
        <Button variant="ghost" size="icon" onClick={() => setVolumeOn(!volumeOn)}>
          <Volume2 className={`h-6 w-6 ${volumeOn ? '' : 'text-gray-400'}`} />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );

  const renderMainPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <motion.main 
        className="flex-grow flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {language === 'en' ? 'Interview warmup' : '面試熱身'}
        </motion.h1>
        <motion.p 
          className="text-center mb-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {language === 'en' ? 'A quick way to prepare for your next interview' : '快速準備下一次面試的方式'}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button onClick={handleStart} size="lg" className="w-full max-w-xs">
            {language === 'en' ? 'Start practicing' : '開始練習'}
          </Button>
        </motion.div>
      </motion.main>
    </div>
  );

  const renderPositionPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow p-4">
        <h2 className="text-2xl font-semibold mb-6">
          {language === 'en' ? 'What field do you want to practice for?' : '你想練習哪個領域的面試？'}
        </h2>
        <div className="space-y-2">
          {positions.map((position) => (
            <Button
              key={position.key}
              variant="outline"
              className="w-full justify-between"
              onClick={() => handlePositionSelect(position.key)}
            >
              {position.label}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </main>
    </div>
  );

  const renderIntroPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {language === 'en' ? 'Answer 5 interview questions' : '回答 5 個面試問題'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              {language === 'en' ? "When you're done, review your answers and discover insights." : '當你完成後，回顧你的回答並探索精闢見解。'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleStartPractice} className="w-full">
              {language === 'en' ? 'Start' : '開始'}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );

  const renderInterviewPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-blue-600">
              {questions[currentStep]?.type === 'Background'
                ? (language === 'en' ? 'Background question' : '背景問題')
                : (language === 'en' ? 'Situational question' : '情境問題')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? questions[currentStep]?.question : questions[currentStep]?.question_zh}
            </h2>
            <div className="mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayAudio}
                className={`${isPlaying ? 'bg-blue-100' : ''}`}
              >
                <Volume2 className={`h-6 w-6 ${isPlaying ? 'text-blue-500' : ''}`} />
              </Button>
              <audio
                ref={audioRef}
                src={language === 'en' ? questions[currentStep]?.voice_file_en : questions[currentStep]?.voice_file_zh}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error('Audio failed to load:', e)}
                className="hidden"
              />
            </div>
            <div className="space-y-4">
              <VoiceRecorder onTranscriptionComplete={(transcription) => setCurrentAnswer(transcription)} />
              <textarea
                className="w-full h-32 p-2 border rounded"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={language === 'en' ? "Type your answer here..." : '在這裡輸入你的答案...'}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentStep + 1}/{totalQuestions}
            </div>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button onClick={handlePrevious} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Previous' : '上一題'}
                </Button>
              )}
              <Button onClick={handleNext} disabled={currentAnswer.trim() === ''}>
                {currentStep < totalQuestions - 1 ? (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Next' : '下一題'}
                  </>
                ) : (
                  <>
                    <span className="mr-2 inline-block w-4 h-4" />  
                    <span className="flex items-center justify-center">
                      {language === 'en' ? 'Finish' : '看分析'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      <footer className="p-4">
        <Progress value={(currentStep + 1) / totalQuestions * 100} className="w-full" />
      </footer>
    </div>
  );

  const renderAnalysisPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {language === 'en' ? "Congrats, you did it! Let's review." : '恭喜你，你做到了！讓我們回顧一下。'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              {language === 'en' ? "Use the insight buttons to learn more about your answers. Try to reflect on what you'd like to improve, then practice again." : '使用見解按鈕了解更多關於你的答案。試著反思你想要改進的地方，然後再次練習。'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handlePracticeAgain} variant="outline" className="w-full">
              {language === 'en' ? 'Practice again' : '再次練習'}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );

  switch (currentPage) {
    case 'main':
      return renderMainPage();
    case 'position':
      return renderPositionPage();
    case 'intro':
      return renderIntroPage();
    case 'interview':
      return renderInterviewPage();
    case 'analysis':
      return renderAnalysisPage();
    default:
      return renderMainPage();
  }
}