'use client'

import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Mock data for questions
const questions = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  content: `This is the content for question ${i + 1}. It can be a longer text explaining the question in detail.`
}))

export default function QuestionList() {
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0])
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})

  const handleQuestionClick = (question: typeof questions[0]) => {
    setSelectedQuestion(question)
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers(prev => ({ ...prev, [selectedQuestion.id]: e.target.value }))
  }

  return (
    <div className="flex h-screen">
      {/* Left side: Scrollable list of questions */}
      <div className="w-1/3 border-r">
        <ScrollArea className="h-full">
          {questions.map(question => (
            <Button
              key={question.id}
              variant={selectedQuestion.id === question.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleQuestionClick(question)}
            >
              Question {question.id}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Right side: Selected question content and answer input */}
      <div className="w-2/3 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Question {selectedQuestion.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{selectedQuestion.content}</p>
            <Input
              placeholder="Type your answer here"
              value={answers[selectedQuestion.id] || ''}
              onChange={handleAnswerChange}
            />
          </CardContent>
          <CardFooter>
            <Button> Submit </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}