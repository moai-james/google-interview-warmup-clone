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
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

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
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleUserInfo = () => {
    router.push('/user/profile');
  };

  const renderHeader = () => (
    <header className="flex items-center justify-between p-2 sm:p-4 bg-white border-b relative">
      {currentPage !== 'main' && (
        <Button variant="ghost" size="sm" onClick={handlePreviousStep} className="absolute left-2 sm:left-4">
          <ArrowLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      )}
      <h1 className="text-lg sm:text-xl font-semibold flex-grow text-center">
        {language === 'en' ? 'Interview warmup' : '模擬面試'}
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="absolute right-2 sm:right-4">
            <User className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleUserInfo}>
            {language === 'en' ? 'User Profile' : '帳號'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            {language === 'en' ? 'Log Out' : '登出'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
          className="text-2xl sm:text-4xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {language === 'en' ? 'Interview warmup' : '面試熱身'}
        </motion.h1>
        <motion.p 
          className="text-center mb-8 max-w-md text-sm sm:text-base"
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
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          {language === 'en' ? 'What field do you want to practice for?' : '你想練習哪個領域的面試？'}
        </h2>
        <div className="space-y-2">
          {positions.map((position) => (
            <Button
              key={position.key}
              variant="outline"
              className="w-full justify-between text-sm sm:text-base"
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
            <CardTitle className="text-center text-lg sm:text-xl">
              {language === 'en' ? 'Answer 5 interview questions' : '回答 5 個面試問題'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-sm sm:text-base">
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
            <CardTitle className="text-xs sm:text-sm font-normal text-blue-600">
              {questions[currentStep]?.type === 'Background'
                ? (language === 'en' ? 'Background question' : '背景問題')
                : (language === 'en' ? 'Situational question' : '情境問題')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {language === 'en' ? questions[currentStep]?.question : questions[currentStep]?.question_zh}
            </h2>
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayAudio}
                className={`${isPlaying ? 'bg-blue-100' : ''}`}
              >
                <Volume2 className={`h-4 w-4 sm:h-6 sm:w-6 ${isPlaying ? 'text-blue-500' : ''}`} />
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
                className="w-full h-32 p-2 border rounded text-sm sm:text-base"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={language === 'en' ? "Type your answer here..." : '在這裡輸入你的答案...'}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600">
              {currentStep + 1}/{totalQuestions}
            </div>
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button onClick={handlePrevious} variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Previous' : '上一題'}
                </Button>
              )}
              <Button onClick={handleNext} disabled={currentAnswer.trim() === ''} size="sm">
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
            <CardTitle className="text-center text-lg sm:text-xl">
              {language === 'en' ? "Congrats, you did it! Let's review." : '恭喜你，你做到了！讓我們回顧一下。'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-sm sm:text-base">
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