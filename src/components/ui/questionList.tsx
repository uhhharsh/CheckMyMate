'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';

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
  subjectName: string; // Pass the subject name as a prop
}

export default function QuestionList({ questions, subjectName }: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(questions[0] || null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

    // Construct the document ID as `subjectName:UserEmail`
    const documentId = `${subjectName}:${userEmail}`;
    const userAnswersRef = doc(db, "userAnswers", documentId);

    // Save the answer for the selected question
    await setDoc(userAnswersRef, {
      [selectedQuestion.id]: answers[selectedQuestion.id],
    }, { merge: true });
    
    alert("Answer submitted!");
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>Submit</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}