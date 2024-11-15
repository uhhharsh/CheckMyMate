'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  information: string;
  instructions: string;
  predictedMarks: string;
  question: string;
  sample_answer: string;
}

interface QuestionListProps {
  questions: Question[];
  subjectName: string; // Pass the subject name as a prop
}

export default function QuestionList({ questions, subjectName }: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(questions[0] || null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter for navigation

  const handleEndExam = () => {
    // Navigate to the student dashboard
    router.push('/studentDashboard');
  };

  // Fetch current user email
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      console.error("No user is currently logged in.");
    }
  }, []);

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedQuestion) {
      setAnswers(prev => ({ ...prev, [selectedQuestion.id]: e.target.value }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuestion || !userEmail) return;

    try {
      // Make a POST request to FastAPI to get predicted marks
      const response = await axios.post("http://127.0.0.1:8000/predict-marks", {
        subject: subjectName,
        marks: parseInt(selectedQuestion.marks, 10) || 0,  // Default to 0 if marks is not a valid number
        sample_answer: selectedQuestion.sample_answer,
        question: selectedQuestion.question,
        info: selectedQuestion.information,
        instructions: [selectedQuestion.instructions]
      });
  
      // Extract predicted marks from FastAPI response
      const predictedMarks = response.data.predicted_marks;
  
      // Construct the document ID as `subjectName:UserEmail`
      const documentId = `${subjectName}:${userEmail}`;
      const userAnswersRef = doc(db, "userAnswers", documentId);
  
      // Save the answer and predicted marks for the selected question
      await setDoc(userAnswersRef, {
        [selectedQuestion.id]: {
          answer: answers[selectedQuestion.id],
          marks: predictedMarks
        }
      }, { merge: true });
      
      // Update local state with predicted marks
      setAnswers((prev) => ({
        ...prev,
        [selectedQuestion.id]: answers[selectedQuestion.id],
      }));
      setSelectedQuestion((prev) =>
        prev ? { ...prev, predictedMarks } : prev
      );

      alert("Answer and predicted marks submitted!");
    } catch (error) {
      console.error("Error predicting marks or saving data:", error);
      alert("An error occurred while submitting your answer.");
    }
  };

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

      {/* Right side: Selected question content and answer input */}
      <div className="w-2/3 p-6">
        {selectedQuestion && (
          <Card>
            <CardHeader>
              <CardTitle>Question {selectedQuestion.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{selectedQuestion.question}</p>
              <Input
                placeholder="Type your answer here"
                value={answers[selectedQuestion.id] || ''}
                onChange={handleAnswerChange}
              />
              {selectedQuestion.predictedMarks !== undefined && (
                <p className="mt-4 text-green-500">
                  Predicted Marks: {selectedQuestion.predictedMarks}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>Submit</Button>
            </CardFooter>
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
      
    </div>
  );
}