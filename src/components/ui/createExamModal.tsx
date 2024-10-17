// components/CreateExamModal.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface CreateExamModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface CourseFormValues {
    courseCode: string;
    courseName: string;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({ isOpen, onOpenChange }) => {
    const { register, handleSubmit, reset } = useForm<CourseFormValues>();

    const onSubmit: SubmitHandler<CourseFormValues> = async (data) => {
        const { courseCode, courseName } = data;
        const courseRef = doc(db, "Courses", courseCode);

        const courseDoc = await getDoc(courseRef);
        if (courseDoc.exists()) {
            alert("Course already exists!");
        } else {
            await setDoc(courseRef, {
                courseCode,
                courseName,
                teacherId: "YOUR_TEACHER_ID", // Replace with the actual teacher ID
                studentIds: [],
                exams: []
            });
            alert("Course created successfully!");
        }
        reset();
        onOpenChange(false); // Close the modal after submission
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>Create Exam</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                    Enter the course details below.
                </DialogDescription>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="courseCode" className="block">Course Code</label>
                        <Input {...register("courseCode", { required: true })} id="courseCode" />
                    </div>
                    <div>
                        <label htmlFor="courseName" className="block">Course Name</label>
                        <Input {...register("courseName", { required: true })} id="courseName" />
                    </div>
                    <div className="flex justify-end">
                        <Button type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Create Course</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateExamModal;
