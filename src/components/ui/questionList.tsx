'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface Question {
  id: number;
  information: string;
  instructions: string;
  marks: string;
  question: string;
  sample_answer: string;
}

interface QuestionListProps {
  questions: Question[];
  subjectName: string;
  user: any; // Add user prop
}

export default function QuestionList({ questions, subjectName, user }: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(questions[0] || null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [totalMarks, setTotalMarks] = useState<number | null>(null);
  const router = useRouter();

  // Update selected question when questions prop changes
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedQuestion(questions[0]);
    }
  }, [questions]);

  // If no user is present, redirect to login
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEndExam = () => {
    setIsDialogOpen(true);
  };
  
  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedQuestion) {
      setAnswers(prev => ({ ...prev, [selectedQuestion.id]: e.target.value }));
    }
  };

  const handleSubmitAll = async () => {
    if (!user?.email) {
      console.error("No user email found");
      return;
    }

    try {
      const predictedMarksArray: number[] = [];
      const documentId = `${subjectName}:${user.email}`;
      const userAnswersRef = doc(db, "userAnswers", documentId);

      // Collect all answers and predicted marks
      for (const question of questions) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/predict-marks", {
            // Your API payload
          });

          const predictedMarks = response.data.predicted_marks;
          predictedMarksArray.push(predictedMarks);

          // Save individual question answers and marks
          await setDoc(userAnswersRef, {
            [question.id]: {
              answer: answers[question.id] || '',
              marks: predictedMarks
            }
          }, { merge: true });
        } catch (error) {
          console.error(`Error processing question ${question.id}:`, error);
        }
      }

      // Calculate and save total marks
      const totalMarks = predictedMarksArray.reduce((acc, curr) => acc + curr, 0);
      await setDoc(userAnswersRef, { totalMarks }, { merge: true });

      setTotalMarks(totalMarks);
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An error occurred while submitting the exam.");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Left side: Scrollable list of questions */}
      <div className="w-1/3 border-r">
        <ScrollArea className="h-full">
          {questions.map(question => (
            <Button
              key={question.id}
              variant={selectedQuestion?.id === question.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleQuestionClick(question)}
            >
              Question {question.id}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Right side: Selected question content */}
      <div className="w-2/3 p-6">
        {selectedQuestion && (
          <Card>
            <CardHeader>
              <CardTitle>Question {selectedQuestion.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{selectedQuestion.question}</p>
              <textarea
                placeholder="Type your answer here"
                value={answers[selectedQuestion.id] || ''}
                onChange={handleAnswerChange}
                onInput={(e) => {
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = 'auto'; // Reset height
                  textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to content height
                }}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1} // Minimum rows
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* End Exam Button */}
      <Button
        className="absolute bottom-4 right-4 bg-red-500 text-white hover:bg-red-600"
        onClick={handleEndExam}
      >
        End Exam
      </Button>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {totalMarks === null ? (
            <>
              <p>Do you want to submit your answers?</p>
              <DialogFooter>
                <Button variant="secondary" onClick={handleSubmitAll}>Yes, Submit</Button>
                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <p>Your answers have been submitted successfully!</p>
              <p className="mt-2 text-green-600">Total Predicted Marks: {totalMarks}</p>
              <DialogFooter>
                <Button variant="secondary" onClick={() => router.push('/studentDashboard')}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}