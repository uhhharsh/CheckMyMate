import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Component() {
  const router = useRouter()
  const [subjectName, setSubjectName] = useState("CS150")
  const [numberOfQuestions, setNumberOfQuestions] = useState("10")

  const handleSubmit = () => {
    router.push(`/createExam?subjectName=${encodeURIComponent(subjectName)}&numberOfQuestions=${encodeURIComponent(numberOfQuestions)}`)
  }

  return (
    <>
      <Dialog defaultOpen>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Write Subject Name</DialogTitle>
            <DialogDescription>Create Exam for this subject</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectName" className="text-right">
                Subject Name
              </Label>
              <Input
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberOfQuestions" className="text-right">
                Number Of Questions
              </Label>
              <Input
                id="numberOfQuestions"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Component