'use client'

import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import NavBar from "@/components/ui/navBar";
import QuestionList from "@/components/ui/questionList";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Exam() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const subjectName = searchParams.get('subjectName') || '';
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Handle authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Fetch questions only when user is authenticated
    useEffect(() => {
        if (!user || !subjectName) return;

        const fetchQuestions = async () => {
            try {
                const db = getFirestore();
                const examRef = doc(db, "exams", subjectName);
                const examSnap = await getDoc(examRef);

                if (examSnap.exists()) {
                    const questionsData = examSnap.data().questions || [];
                    setQuestions(questionsData);
                } else {
                    console.error("No such exam found!");
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [user, subjectName]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            Loading...
        </div>;
    }

    if (!user) {
        return null; // Router will redirect
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4 p-4"> 
                <div className="rounded sticky top-0"> 
                    <NavBar />
                </div>
            </div>
            
            <QuestionList 
                questions={questions} 
                subjectName={subjectName}
                user={user} // Pass user to QuestionList
            />
        </>
    );
}