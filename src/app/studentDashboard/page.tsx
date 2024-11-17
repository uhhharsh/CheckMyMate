'use client';

import React, { useEffect, useState } from "react";
import NavBar from "@/components/ui/navBar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { collection, query, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
    const router = useRouter();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<any[]>([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        // Only fetch data if user is authenticated
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch Exams
                const examsCollection = collection(db, "exams");
                const examSnapshot = await getDocs(examsCollection);
                const examList = examSnapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                setExams(examList);
                setLoading(false);

                // Fetch Results
                const userAnswersCollection = collection(db, "userAnswers");
                const snapshot = await getDocs(userAnswersCollection);
                
                const userResults = snapshot.docs
                    .filter(doc => doc.id.includes(user.email || ""))
                    .map(doc => {
                        const data = doc.data();
                        const [subjectName] = doc.id.split(":");
                        const totalMarks = Object.values(data).reduce((sum, item: any) => 
                            sum + (item.marks || 0), 0);
                        
                        return { 
                            id: doc.id,
                            subjectName, 
                            totalMarks 
                        };
                    });

                setResults(userResults);
                setLoadingResults(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
                setLoadingResults(false);
            }
        };

        fetchData();
    }, [user]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/');
        } catch (error) {
            console.error("Error occurred while logging out", error);
        }
    };

    const handleViewExam = (exam: any) => {
        router.push(`/exam?subjectName=${exam.subjectName}`);
    };

    // Show loading state while checking authentication
    if (!user) {
        return <div className="flex justify-center items-center min-h-screen">
            Loading...
        </div>;
    }

    return (
        <>
            {/* Rest of your JSX remains the same */}
            {/* navBar container */}
            <div className="flex flex-col items-center justify-center gap-4 p-4"> 
                <div className="rounded sticky top-0"> 
                    <NavBar />
                </div>
            </div>

            {/* dashboard container */}
            <div className="flex min-h-screen w-full">
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
                    {/* Dashboard Header */}
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/mahdis-mousavi-hJ5uMIRNg5k-unsplash.jpg"
                                width={36}
                                height={36}
                                alt="Avatar"
                                className="rounded-full"
                                style={{ aspectRatio: "36/36", objectFit: "cover" }}
                            />
                            <div className="grid gap-0.5">
                                <div className="font-medium">{user.displayName || 'Student'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                            <Button onClick={handleLogout}>Logout</Button>
                        </div>
                    </header>
                    
                    {/* Current Exams and Result */}
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Current exams */}
                            <Card className="sm:col-span-2">
                                <CardHeader>
                                    <CardTitle>Exams</CardTitle>
                                    <CardDescription>Your current exams for the semester.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        {loading ? (
                                            <p>Loading exams...</p>
                                        ) : exams.length === 0 ? (
                                            <p>No exams available</p>
                                        ) : (
                                            exams.map(exam => (
                                                <div key={exam.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg bg-background p-4">
                                                    <div className="rounded-full bg-accent p-2 text-accent-foreground">
                                                        <div className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{exam.subjectName}</div>
                                                        <div className="text-sm text-muted-foreground">Professor: {exam.professorName}</div>
                                                    </div>
                                                    <Button size="sm" variant="outline" onClick={() => handleViewExam(exam)}>View</Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            {/* Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Results</CardTitle>
                                    <CardDescription>Your results for the semester exams.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        {loadingResults ? (
                                            <p>Loading results...</p>
                                        ) : results.length === 0 ? (
                                            <p>No results available</p>
                                        ) : (
                                            results.map(result => (
                                                <div key={result.id} className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg bg-background p-4">
                                                    <div className="rounded-full bg-accent p-2 text-accent-foreground">
                                                        <div className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{result.subjectName}</div>
                                                        <div className="text-sm">Total Marks: {result.totalMarks}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}