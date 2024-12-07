'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { db } from "@/firebase/firebaseConfig" 

import { doc, setDoc } from 'firebase/firestore'

interface Question {
  id: number;
  question: string;
  marks: string;
  sample_answer: string;
  instructions: string;
}

interface TeacherQuestionListProps {
  numberOfQuestions: number;
  subjectName: string;
}

export default function TeacherQuestionList({ numberOfQuestions = 1, subjectName }: TeacherQuestionListProps) {
  const router = useRouter()

  const initialQuestions: Question[] = Array.from({ length: numberOfQuestions }, (_, i) => ({
    id: i + 1,
    question: "",
    marks: "",
    sample_answer: "",
    instructions: ""
  }))

  const [selectedQuestion, setSelectedQuestion] = useState<Question>(initialQuestions[0])
  const [allQuestions, setAllQuestions] = useState<Question[]>(initialQuestions)

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Question) => {
    setAllQuestions(prev => 
      prev.map(q => q.id === selectedQuestion.id ? { ...q, [field]: e.target.value } : q)
    )
  }

  const handleSubmitExam = async () => {
    const examData = {
      subjectName,
      questions: allQuestions
    }

    try {
      await setDoc(doc(db, "exams", subjectName), examData)
      alert("Exam submitted successfully!")
      router.push('/teacherDashboard')
    } catch (error) {
      console.error("Error submitting exam: ", error)
      alert("Failed to submit exam. Please try again.")
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <ScrollArea className="h-full">
          {allQuestions.map(question => (
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

      <div className="w-2/3 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Question {selectedQuestion.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter question"
              value={allQuestions.find(q => q.id === selectedQuestion.id)?.question || ''}
              onChange={(e) => handleInputChange(e, 'question')}
              className="mb-4 min-h-[100px]"
            />
            <Input
              placeholder="Enter marks"
              value={allQuestions.find(q => q.id === selectedQuestion.id)?.marks || ''}
              onChange={(e) => handleInputChange(e, 'marks')}
              className="mb-4"
            />
            <Textarea
              placeholder="Enter sample answer"
              value={allQuestions.find(q => q.id === selectedQuestion.id)?.sample_answer || ''}
              onChange={(e) => handleInputChange(e, 'sample_answer')}
              className="mb-4 min-h-[150px]"
            />
            <Textarea
              placeholder="Enter instructions"
              value={allQuestions.find(q => q.id === selectedQuestion.id)?.instructions || ''}
              onChange={(e) => handleInputChange(e, 'instructions')}
              className="mb-4 min-h-[100px]"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitExam}>Submit Exam</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}