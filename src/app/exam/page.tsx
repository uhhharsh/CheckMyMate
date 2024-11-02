'use client'

import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import NavBar from "@/components/ui/navBar";
import QuestionList from "@/components/ui/questionList";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { log } from "console";

export default function Exam() {
    const searchParams = useSearchParams();
    const subjectName = searchParams.get('subjectName') || '';
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const db = getFirestore();
            const examRef = doc(db, "exams", subjectName);
            const examSnap = await getDoc(examRef);

            if (examSnap.exists()) {
                const questionsData = examSnap.data().questions || [];
                setQuestions(questionsData);
            } else {
                console.error("No such exam found!");
            }
        };

        if (subjectName) {
            fetchQuestions().catch(console.error);
        }
    }, [subjectName]);

    console.log("hi");
    console.log(questions);
    
    return (
        <>
            {/* navBar container */}
            <div className="flex flex-col items-center justify-center gap-4 p-4"> 
                <div className="rounded sticky top-0"> 
                    <NavBar />
                </div>
            </div>
            
            {/* Pass questions to QuestionList */}
            <QuestionList questions={questions} subjectName={subjectName}/>
        </>
    )
}