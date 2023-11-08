import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/backend/firebase";
import { useSession } from "next-auth/react";

const CreateTaskDialog = ({ id }: any) => {
  const { data: session } = useSession();
  const [projectId, setProjectId] = useState<string>("");
  const [members, setMembers] = useState<any>([]);
  const email = session?.user?.email;
  const [values, setValues] = useState({
    title: "",
    tags: "",
    assignedTo: "",
    status: "",
  });
  const TAGS = ["Design", "Dev", "Planning", "Testing", "Deploy"];
  const STATUS = ["Backlog", "Ready", "In Progress", "Review", "Done"];
  const handleValuesChange =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => {
        return { ...prev, [key]: e.target.value };
      });
    };

  const handleTagsSelect = (val: string) => {
    setValues((prev) => {
      return { ...prev, tags: val };
    });
  };
  const handleAssignSelect = (val: string) => {
    setValues((prev) => {
      return { ...prev, assignedTo: val };
    });
  };
  const handleStatusSelect = (val: string) => {
    setValues((prev) => {
      return { ...prev, status: val };
    });
  };

  const getTaskId = async () => {
    const initialVal = 230001;
    const coll = collection(db, "projects", id, "tasks");
    const snapshot = await getCountFromServer(coll);

    return `TS${initialVal + snapshot.data().count}`;
  };

  const handleAddTask = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    if (docData?.status === "Initialized") {
      await updateDoc(docRef, {
        status: "On Progress",
      }).then(async () => {
        if (
          !values.title ||
          !values.tags ||
          !values.assignedTo ||
          !values.status
        ) {
          alert("Please fill all the fields");
        } else {
          const taskId = await getTaskId();
          const docRef = doc(db, "projects", id, "tasks", taskId);
          await setDoc(
            docRef,
            {
              ...values,
              createdAt: serverTimestamp(),
              createdBy: session?.user?.image,
            },
            { merge: true }
          );
          alert("Task Added Successfully");
        }
      });
    }
    else if(docData?.status === 'Completed'){
      alert("Project is Completed")
    }
    else{
      if (
        !values.title ||
        !values.tags ||
        !values.assignedTo ||
        !values.status
      ) {
        alert("Please fill all the fields");
      } else {
        const taskId = await getTaskId();
        const docRef = doc(db, "projects", id, "tasks", taskId);
        await setDoc(
          docRef,
          {
            ...values,
            createdAt: serverTimestamp(),
            createdBy: session?.user?.image,
          },
          { merge: true }
        );
        alert("Task Added Successfully");
      }
    }
  };
  useEffect(() => {
    if (id) {
      const unsub = onSnapshot(doc(db, "projects", `${id}`), (docs) => {
        const project = docs?.data();
        setMembers(project?.members);
      });
      return () => unsub();
    }
  }, [id]);
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="font-semibold h-12" variant={"outline"}>
            Create a Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleAddTask}
                className="mt-4 flex flex-col gap-4"
              >
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    onChange={handleValuesChange("title")}
                    type="text"
                    id="title"
                    placeholder="Enter the Task Title"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="tags" className="mb-2">
                    Category Tags
                  </Label>
                  <Select required onValueChange={handleTagsSelect}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAGS.map((item, idx) => (
                        <SelectItem key={idx} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="assign" className="mb-2">
                    Assign to
                  </Label>
                  <Select required onValueChange={handleAssignSelect}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((item: any) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="status" className="mb-2">
                    Task Status
                  </Label>
                  <Select required onValueChange={handleStatusSelect}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS.map((item, idx) => (
                        <SelectItem key={idx} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <DialogTrigger>
                    <Button type="submit" className="w-full h-12">
                      Add Task
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

export default CreateTaskDialog;
