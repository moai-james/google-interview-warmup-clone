'use client'

import { useState } from 'react'
import { ArrowLeft, Mic, Keyboard, ArrowRight, Volume2, MoreVertical, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const positions = [
  "Data Analytics",
  "Digital Marketing and E-Commerce",
  "IT Support",
  "Project Management",
  "UX Design",
  "Cybersecurity",
  "General"
]

export function InterviewWarmupComponent() {
  const [currentPage, setCurrentPage] = useState('main')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [volumeOn, setVolumeOn] = useState(true)
  const totalQuestions = 5
  const [isRecording, setIsRecording] = useState(false)

  const questions = [
    "Please tell me why you would be a good fit for this role.",
    "What's your greatest professional achievement?",
    "How do you handle stress and pressure?",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for us?"
  ]

  const handleStart = () => {
    setCurrentPage('position')
  }

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position)
    setCurrentPage('intro')
  }

  const handleStartPractice = () => {
    setCurrentPage('interview')
  }

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentPage('analysis')
    }
  }

  const handlePracticeAgain = () => {
    setCurrentStep(0)
    setCurrentPage('main')
    setSelectedPosition('')
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
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1)
        } else {
          setCurrentPage('intro')
        }
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
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Interview warmup</h1>
        <p className="text-center mb-8 max-w-md">
          A quick way to prepare for your next interview
        </p>
        <Button onClick={handleStart} size="lg" className="w-full max-w-xs">Start practicing</Button>
      </main>
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
            <CardTitle className="text-sm font-normal text-blue-600">Background question</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{questions[currentStep]}</h2>
            <div className="flex space-x-2">
              <Button className="flex-1">
                <Mic className="mr-2 h-4 w-4" /> Answer with voice
              </Button>
              <Button variant="outline" className="flex-1">
                <Keyboard className="mr-2 h-4 w-4" /> Answer with text
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentStep + 1}/{totalQuestions}
            </div>
            <Button onClick={handleNext}>
              <ArrowRight className="mr-2 h-4 w-4" /> Next
            </Button>
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
              Use the insight buttons to learn more about your answers. Try to reflect on what you said from the perspective of an interviewer. Identify what you&apos;d like to improve, then practice again.
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