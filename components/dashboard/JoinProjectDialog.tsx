import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/backend/firebase";
import { useSession } from "next-auth/react";

const JoinProjectDialog = () => {
  const { data: session } = useSession();
  const [projectId,setProjectId] = useState<string>("");
  const email = session?.user?.email
  const handleAddMembers = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(projectId);

    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && email) {
      await updateDoc(docRef, {
        members: arrayUnion(session?.user?.name),
        membersEmail: arrayUnion(email)
      }).then(() => {
        alert("Member added successfully");
      });
    } else {
      alert("Project does not exist");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="font-semibold h-12" variant={"outline"}>
            Join a Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleAddMembers}
                className="mt-4 flex flex-col gap-4"
              >
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="id">Project Id</Label>
                  <Input onChange={(e) => setProjectId(e.target.value)} type="text" id="id" placeholder="Enter the Project Id" />
                </div>
                <div>
                  <DialogTrigger>
                    <Button type="submit" className="w-full h-12">
                      Join
                    </Button>
                  </DialogTrigger>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinProjectDialog;
