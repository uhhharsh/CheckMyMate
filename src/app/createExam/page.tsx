import React from "react";
import QuestionList from "@/components/ui/questionList";
import NavBar from "@/components/ui/navBar";

export default function Exam() {
    return (
        <>
            {/* navBar container */}
            <div className="flex flex-col items-center justify-center gap-4 p-4"> 
                <div className="rounded sticky top-0"> 
                    <NavBar />
                </div>
            </div>
            <QuestionList />
        </>
    )
}