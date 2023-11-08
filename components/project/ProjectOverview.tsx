import { CalendarDays, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
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
const STATUS = ["Backlog", "Ready", "In Progress", "Review", "Done"];
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/router";
import CreateTaskDialog from "./CreateTaskDialog";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/backend/firebase";
// interface Task {
//   title: string;
//   tags: string;
//   status: string;
//   assignedTo: string;
//   createdAt: any;
//   createdBy: string;
// }[]

const ProjectOverview = ({id}:any) => {
  const { data: session } = useSession();
  const [tasks,setTasks] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [status,setStatus] = useState<string>("");
  const [taskId,setTaskId] = useState<string>("");
  const handleStatusChange = (id:any) => {
    setTaskId(id);
    setOpen(true);
  }
  const handleStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const docRef = doc(db, "projects", id, "tasks", taskId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        status: status,
      }).then(() => {
        alert("Task Status Updated Successfully");
      });
    } else {
      alert("Error No such Task exists");
    }
    setOpen(false);
  };
  useEffect(() => {
    if (id) {
      const unsub = onSnapshot(
       collection(db, "projects", id, "tasks"),
        (docs) => {
          const tasks: any = [];
          docs.forEach((doc) => {
            tasks.push({ ...doc.data(), id: doc.id });
          });
          setTasks(tasks);
        }
      );
      return () => unsub();
    }
  }, [id]);
  console.log(tasks)
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Task Status</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleStatus}>
                <section className="mt-4 flex flex-col gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="status" className="mb-2">
                      Task Status
                    </Label>
                    <Select required onValueChange={(e) => setStatus(e)}>
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
                  <Button type="submit" className="w-full h-12">
                    Change
                  </Button>
                </section>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col overflow-y-auto ">
        <div className="ml-auto">
          <CreateTaskDialog id={id} />
        </div>
        <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
          <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
              <span className="text-md font-semibold">Backlog</span>
            </div>
            <div className="flex flex-col pb-2 overflow-auto">
              {tasks &&
                tasks
                  .filter((task: any) => task.status === "Backlog")
                  .map((task: any) => (
                    <div
                      className="relative flex flex-col items-start p-4 mt-3 bg-app-grey-light shadow-md rounded-lg cursor-pointer "
                      draggable="true"
                      key={task.id}
                      onClick={() => handleStatusChange(task.id)}
                    >
                      <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                        {task.tags}
                      </span>
                      <h4 className="mt-3 text-sm font-medium">{task.title}</h4>
                      <span className=" mt-3 text-sm font-medium">
                        Assigned to : {task.assignedTo}
                      </span>
                      <div className="flex items-center justify-between w-full mt-3 text-xs font-medium text-gray-400">
                        <div className="flex items-center">
                          <CalendarDays strokeWidth={1.5} className="w-5 h-5" />
                          <span className="ml-1 leading-none">
                            {task.createdAt?.toDate()?.toString()?.slice(4, 10)}
                          </span>
                        </div>

                        <Image
                          alt="Photo"
                          width={100}
                          height={100}
                          src={task.createdBy}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
              <span className="text-md font-semibold">Ready</span>
            </div>
            <div className="flex flex-col pb-2 overflow-auto">
              {tasks &&
                tasks
                  .filter((task: any) => task.status === "Ready")
                  .map((task: any) => (
                    <div
                      className="relative flex flex-col items-start p-4 mt-3 bg-app-grey-light shadow-md rounded-lg cursor-pointer "
                      draggable="true"
                      key={task.id}
                      onClick={() => handleStatusChange(task.id)}
                    >
                      <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                        {task.tags}
                      </span>
                      <h4 className="mt-3 text-sm font-medium">{task.title}</h4>
                      <span className=" mt-3 text-sm font-medium">
                        Assigned to : {task.assignedTo}
                      </span>
                      <div className="flex items-center justify-between w-full mt-3 text-xs font-medium text-gray-400">
                        <div className="flex items-center">
                          <CalendarDays strokeWidth={1.5} className="w-5 h-5" />
                          <span className="ml-1 leading-none">
                            {task.createdAt?.toDate()?.toString()?.slice(4, 10)}
                          </span>
                        </div>

                        <Image
                          alt="Photo"
                          width={100}
                          height={100}
                          src={task.createdBy}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              {/* {tasks.filter((task: any) => task.status === "Ready").length ===
                0 && <p className="">No Ready tasks found</p>} */}
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
              <span className="text-md font-semibold">In Progress</span>
            </div>
            <div className="flex flex-col pb-2 overflow-auto">
              {tasks &&
                tasks
                  .filter((task: any) => task.status === "In Progress")
                  .map((task: any) => (
                    <div
                      className="relative flex flex-col items-start p-4 mt-3 bg-app-grey-light shadow-md rounded-lg cursor-pointer "
                      draggable="true"
                      key={task.id}
                      onClick={() => handleStatusChange(task.id)}
                    >
                      <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                        {task.tags}
                      </span>
                      <h4 className="mt-3 text-sm font-medium">{task.title}</h4>
                      <span className=" mt-3 text-sm font-medium">
                        Assigned to : {task.assignedTo}
                      </span>
                      <div className="flex items-center justify-between w-full mt-3 text-xs font-medium text-gray-400">
                        <div className="flex items-center">
                          <CalendarDays strokeWidth={1.5} className="w-5 h-5" />
                          <span className="ml-1 leading-none">
                            {task.createdAt?.toDate()?.toString()?.slice(4, 10)}
                          </span>
                        </div>

                        <Image
                          alt="Photo"
                          width={100}
                          height={100}
                          src={task.createdBy}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
              <span className="text-md font-semibold">Review</span>
            </div>
            <div className="flex flex-col pb-2 overflow-auto">
              {tasks &&
                tasks
                  .filter((task: any) => task.status === "Review")
                  .map((task: any) => (
                    <div
                      className="relative flex flex-col items-start p-4 mt-3 bg-app-grey-light shadow-md rounded-lg cursor-pointer "
                      draggable="true"
                      key={task.id}
                      onClick={() => handleStatusChange(task.id)}
                    >
                      <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                        {task.tags}
                      </span>
                      <h4 className="mt-3 text-sm font-medium">{task.title}</h4>
                      <span className=" mt-3 text-sm font-medium">
                        Assigned to : {task.assignedTo}
                      </span>
                      <div className="flex items-center justify-between w-full mt-3 text-xs font-medium text-gray-400">
                        <div className="flex items-center">
                          <CalendarDays strokeWidth={1.5} className="w-5 h-5" />
                          <span className="ml-1 leading-none">
                            {task.createdAt?.toDate()?.toString()?.slice(4, 10)}
                          </span>
                        </div>

                        <Image
                          alt="Photo"
                          width={100}
                          height={100}
                          src={task.createdBy}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
              <span className="text-md font-semibold">Done</span>
            </div>
            <div className="flex flex-col pb-2 overflow-auto">
              {tasks &&
                tasks
                  .filter((task: any) => task.status === "Done")
                  .map((task: any) => (
                    <div
                      className="relative flex flex-col items-start p-4 mt-3 bg-app-grey-light shadow-md rounded-lg cursor-pointer"
                      draggable="true"
                      key={task.id}
                      onClick={() => handleStatusChange(task.id)}
                    >
                      <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                        {task.tags}
                      </span>
                      <h4 className="mt-3 text-sm font-medium">{task.title}</h4>
                      <span className=" mt-3 text-sm font-medium">
                        Assigned to : {task.assignedTo}
                      </span>
                      <div className="flex items-center justify-between w-full mt-3 text-xs font-medium text-gray-400">
                        <div className="flex items-center">
                          <CalendarDays strokeWidth={1.5} className="w-5 h-5" />
                          <span className="ml-1 leading-none">
                            {task.createdAt?.toDate()?.toString()?.slice(4, 10)}
                          </span>
                        </div>

                        <Image
                          alt="Photo"
                          width={100}
                          height={100}
                          src={task.createdBy}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectOverview;
