'use client'

import React from "react";
import { useSearchParams } from 'next/navigation';
import NavBar from "@/components/ui/navBar";
import TeacherQuestionList from "@/components/ui/teacherQuestionList";

export default function Exam() {
    const searchParams = useSearchParams();
    const subjectName = searchParams.get('subjectName') || '';
    const numberOfQuestions = parseInt(searchParams.get('numberOfQuestions') || '1', 10);

    return (
        <>
            {/* navBar container */}
            <div className="flex flex-col items-center justify-center gap-4 p-4"> 
                <div className="rounded sticky top-0"> 
                    <NavBar />
                </div>
            </div>
            
            {/* Pass props to TeacherQuestionList */}
            <TeacherQuestionList 
                subjectName={subjectName} 
                numberOfQuestions={numberOfQuestions} 
            />
        </>
    )
}