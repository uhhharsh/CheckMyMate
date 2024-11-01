import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

  
function component() {
    return (
        <>
        <Dialog defaultOpen>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write Subject Name</DialogTitle>
          <DialogDescription>
            Create Exam for this subject
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subjectName" className="text-right">
              Subject Name
            </Label>
            <Input
              id="subjectName"
              defaultValue="CS150"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numberOfQuestions" className="text-right">
              Number Of Questions
            </Label>
            <Input
              id="numberOfQuestions"
              defaultValue="10"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
        </Dialog>
        </>
    )
}

export default component;
