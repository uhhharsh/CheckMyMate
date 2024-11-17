'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { auth, app } from "@/firebase/firebaseConfig"
import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';

export default function component({title} : { title : string }) {

  const router = useRouter(); // Initialize useRouter
  const db = getFirestore(app);
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // First set persistence
      await setPersistence(auth, browserLocalPersistence);
    
      // Then handle sign in
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Successfully logged in", user);
      console.log(user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      console.log("userRef is", userRef);
      console.log("userSnap is", userSnap);
      

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        console.log(`${user.email} has role ${role}`);
        
        if (role === 'student') {
          router.push('/studentDashboard');
        } else if (role === 'teacher') {
          router.push('/teacherDashboard');
        }
      } else {
        // First time login, assign role manually or through a selection process
        console.log(`First time login for ${user.email}`);
        
        if(title === "student"){
          await setDoc(userRef, {
            email: user.email,
            enrolledCourses: [],
            name: user.displayName,
            role: 'student',
            taughtCourses: []
          });
          router.push('/studentDashboard');
        }
        else{
          await setDoc(userRef, {
            email: user.email,
            enrolledCourses: [],
            name: user.displayName,
            role: 'teacher',
            taughtCourses: []
          });
          router.push('/teacherDashboard');
        }
      }
    } catch (error) {
      console.log("Error logging into google account : ", error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button type="submit" className="w-full" onClick={handleGoogle}>
            Sign in with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
