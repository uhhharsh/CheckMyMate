'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

// Interfaces
interface Question {
  id: number;
  information: string;
  instructions: string[];
  marks: number;
  question: string;
  sample_answer: string;
}

interface QuestionListProps {
  questions: Question[];
  subjectName: string;
  user: any; 
  examDuration: number; // Duration in minutes
}

// API Prediction Input Interface
interface PredictionInput {
  subject: string;
  marks: number;
  sample_answer: string;
  question: string;
  student_answer: string;
  instructions: string;
}

export default function QuestionList({ 
  questions, 
  subjectName, 
  user, 
  examDuration = 60 // Default to 60 minutes if not specified
}: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(questions[0] || null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [totalMarks, setTotalMarks] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(examDuration * 60); // Convert minutes to seconds
  const router = useRouter();

  // Timer effect
  useEffect(() => {
    // If no time left, auto submit
    if (timeRemaining <= 0) {
      handleSubmitAll();
      return;
    }

    // Create timer interval
    const timerId = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    // Cleanup interval on unmount or when time is up
    return () => clearInterval(timerId);
  }, [timeRemaining]);

  // Format time remaining into minutes:seconds
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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

    setIsSubmitting(true);
    try {
      const predictedMarksArray: number[] = [];
      const documentId = `${subjectName}:${user.email}`;
      const userAnswersRef = doc(db, "userAnswers", documentId);

      // Collect all answers and predicted marks
      for (const question of questions) {
        try {
          // Prepare prediction input
          const predictionInput: PredictionInput = {
            subject: subjectName,
            marks: parseInt(question.marks.toString()),
            sample_answer: question.sample_answer,
            question: question.question,
            student_answer: answers[question.id] || '',
            instructions: Array.isArray(question.instructions) 
            ? question.instructions.join('\n') 
            : (question.instructions || '')
          };
          
          console.log("Prediction Input:", predictionInput);

          // Hit the prediction API
          const response = await axios.post<{ score_gained: number }>(
            "http://localhost:8000/evaluate", 
            predictionInput
          );
            
          const predictedMarks = response.data.score_gained;
          predictedMarksArray.push(predictedMarks);

          console.log("Predicted Marks:", predictedMarks);

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

      // Flatten the predictedMarksArray to ensure it contains only numbers
      const flattenedMarks = predictedMarksArray.flat().map(Number);

      // Calculate and save total marks
      const totalMarks = flattenedMarks.reduce((acc, curr) => acc + curr, 0);
      await setDoc(userAnswersRef, { totalMarks }, { merge: true });

      console.log("Flattened Predicted Marks Array:", flattenedMarks);
      console.log("Total Marks Calculated:", totalMarks);
      
      setTotalMarks(totalMarks);
      setIsDialogOpen(true);
      
      // Redirect to dashboard after submission
      router.push('/studentDashboard');
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An error occurred while submitting the exam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen relative">
      {/* Timer Display */}
      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
        Time Remaining: {formatTime(timeRemaining)}
      </div>

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
                  textarea.style.height = 'auto';
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* End Exam Button */}
      <Button
        className="absolute bottom-4 right-4 bg-red-500 text-white hover:bg-red-600"
        onClick={handleEndExam}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'End Exam'}
      </Button>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {totalMarks === null ? (
            <>
              <p>Do you want to submit your answers?</p>
              <DialogFooter>
                <Button 
                  variant="secondary" 
                  onClick={handleSubmitAll} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <p>Your answers have been submitted successfully!</p>
              <p className="mt-2 text-green-600">Total Predicted Marks: {totalMarks}</p>
              <DialogFooter>
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/studentDashboard')}
                >
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