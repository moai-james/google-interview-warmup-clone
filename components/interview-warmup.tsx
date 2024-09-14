'use client'

import { useState } from 'react'
import { ArrowLeft, Mic, Keyboard, ArrowRight, Volume2, MoreVertical, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from 'framer-motion' // Add this import
import dynamic from 'next/dynamic';
import { parseQuestions, getRandomQuestions } from '@/utils/questionParser';
import { Question } from '@/utils/questionParser';

const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), { ssr: false });

const positions = [
  "Data Analytics",
  "Digital Marketing and E-Commerce",
  "IT Support",
  "Project Management",
  "UX Design",
  "Cybersecurity",
  "Trust Operations Personnel",
  "General"
]

export function InterviewWarmupComponent() {
  const [currentPage, setCurrentPage] = useState('main')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [volumeOn, setVolumeOn] = useState(true)
  const totalQuestions = 5
  const [isRecording, setIsRecording] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>(Array(totalQuestions).fill(''));
  const [questions, setQuestions] = useState<{ question: string; type: string }[]>([]);

  const handleStart = () => {
    setCurrentPage('position')
  }

  const handlePositionSelect = async (position: string) => {
    setSelectedPosition(position);
    try {
      const response = await fetch(`/api/questions?position=${encodeURIComponent(position)}&count=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const selectedQuestions: Question[] = await response.json();
      setQuestions(selectedQuestions.map(q => ({ question: q.question, type: q.type })));
      setCurrentPage('intro');
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  }

  const handleStartPractice = () => {
    setCurrentPage('interview')
  }

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
  }

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
  }

  const handlePreviousStep = () => {
    switch (currentPage) {
      case 'position':
        setCurrentPage('main')
        break
      case 'intro':
        setCurrentPage('position')
        break
      case 'interview':
        handlePrevious()
        break
      case 'analysis':
        setCurrentPage('interview')
        setCurrentStep(totalQuestions - 1)
        break
      default:
        break
    }
  }

  const renderHeader = () => (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <Button variant="ghost" size="icon" onClick={handlePreviousStep}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-semibold">Interview warmup</h1>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => setVolumeOn(!volumeOn)}>
          <Volume2 className={`h-6 w-6 ${volumeOn ? '' : 'text-gray-400'}`} />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )

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
          Interview warmup
        </motion.h1>
        <motion.p 
          className="text-center mb-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          A quick way to prepare for your next interview
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button onClick={handleStart} size="lg" className="w-full max-w-xs">Start practicing</Button>
        </motion.div>
      </motion.main>
    </div>
  )

  const renderPositionPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow p-4">
        <h2 className="text-2xl font-semibold mb-6">What field do you want to practice for?</h2>
        <div className="space-y-2">
          {positions.map((position) => (
            <Button
              key={position}
              variant="outline"
              className="w-full justify-between"
              onClick={() => handlePositionSelect(position)}
            >
              {position}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </main>
    </div>
  )

  const renderIntroPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Answer 5 interview questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              When you're done, review your answers and discover insights.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleStartPractice} className="w-full">Start</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )

  const renderInterviewPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-blue-600">
              {questions[currentStep]?.type === 'Background' ? 'Background question' : 'Situational question'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{questions[currentStep]?.question}</h2>
            <div className="space-y-4">
              <VoiceRecorder onTranscriptionComplete={(transcription) => setCurrentAnswer(transcription)} />
              <textarea
                className="w-full h-32 p-2 border rounded"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
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
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep < totalQuestions - 1 ? (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" /> Next
                  </>
                ) : (
                  <>
                    <span className="mr-2 inline-block w-4 h-4" />  
                    <span className="flex items-center justify-center">Finish</span>
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
  )

  const renderAnalysisPage = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Congrats, you did it! Let&apos;s review.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Use the insight buttons to learn more about your answers. Try to reflect on what you&apos;d like to improve, then practice again.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handlePracticeAgain} variant="outline" className="w-full">Practice again</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )

  switch (currentPage) {
    case 'main':
      return renderMainPage()
    case 'position':
      return renderPositionPage()
    case 'intro':
      return renderIntroPage()
    case 'interview':
      return renderInterviewPage()
    case 'analysis':
      return renderAnalysisPage()
    default:
      return renderMainPage()
  }
}