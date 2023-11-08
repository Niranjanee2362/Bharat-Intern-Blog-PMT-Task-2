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
import { Textarea } from "@/components/ui/textarea";
import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/backend/firebase";
import { useSession } from "next-auth/react";

const CreateNewProjectDialog = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [values, setValues] = useState({
    title: "",
    description: "",
  });

  const getRandomString = async (): Promise<string> => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    randomString += getRandomCharacter("0123456789");
    randomString += getRandomCharacter("0123456789");

    for (let i = 0; i < 4; i++) {
      randomString += getRandomCharacter(characters);
    }
    const collectionRef = collection(db, "projects");
    const q = await getDocs(collectionRef);
    const ids = q.docs.map((doc) => doc.id);
    if (ids.includes(randomString)) {
      getRandomString();
    }

    return randomString;
  };

  const getRandomCharacter = (characterSet: string): string => {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    return characterSet.charAt(randomIndex);
  };
  const handleValuesChange =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => {
        return { ...prev, [key]: e.target.value };
      });
    };

  const handleCreateProject = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!values.title || !values.description) {
      alert("Please fill all the fields");
    } else {
      const ProjectId = await getRandomString();
      const docRef = doc(db, "projects", ProjectId);
      await setDoc(
        docRef,
        {
          ...values,
          createdBy: session?.user?.email!,
          members: [session?.user?.name],
          membersEmail: [session?.user?.email],
          status: 'Initialized'
        },
        { merge: true }
      );
      setOpen(false);
      alert("Paper Added");
    }
  };
  return (
    <div suppressHydrationWarning>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="font-semibold h-12" variant={"default"}>
            Create New Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleCreateProject}>
                <section className="mt-4 flex flex-col gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      onChange={handleValuesChange("title")}
                      required
                      type="text"
                      id="title"
                      placeholder="Title of the Project"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      onChange={handleValuesChange("description")}
                      required
                      placeholder="Description of the Project"
                      id="description"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Creator&apos;s Email</Label>
                    <Input
                      type="text"
                      id="email"
                      value={session?.user?.email!}
                      disabled
                    />
                  </div>
                  <Button type="submit" className="w-full h-12">
                    Create
                  </Button>
                </section>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNewProjectDialog;
