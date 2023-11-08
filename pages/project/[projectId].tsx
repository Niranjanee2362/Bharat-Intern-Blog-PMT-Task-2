import { db } from '@/backend/firebase';
import ProjectChat from '@/components/project/ProjectChat';
import ProjectOverview from '@/components/project/ProjectOverview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function ProjectId() {
    const router = useRouter();
    const { projectId } = router.query;
    const [project, setProject] = useState<any>([]);

    const handleProjectChange = async() => {
      const docRef = doc(db, "projects", `${projectId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          status: 'Completed',
        }).then(() => {
          alert("Status Updated successfully");
        });
      } else {
        alert("Project does not exist");
      }
    }
    const handleCopyProjectId = () => {
      navigator.clipboard.writeText(`${projectId}`);
      alert('Copied to Clipboard !')
    }
    useEffect(() => {
      if (projectId) {
        const unsub = onSnapshot(doc(db, "projects", `${projectId}`), (docs) => {
          setProject(docs?.data());
        });
        return () => unsub();
      }
    }, [projectId]);
    console.log(project);
  return (
    <main className="min-h-screen bg-[url('/assets/line-bg.png')] w-full font-outfit bg-app-grey-dark text-stone-200">
      <div className="p-4 md:px-16 lg:max-w-7xl lg:mx-auto">
        <div className="flex items-center sm:justify-between sm:gap-4">
          <div className="flex flex-1 items-center justify-end gap-8">
            {/* <ConnectWalletButton /> */}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mt-8 md:items-center gap-4 md:gap-0">
          <div className="">
            <h1 className="text-3xl font-bold md:text-5xl">{project.title}</h1>

            <p className="mt-1.5 text-md text-slate-300">
              {project.description}
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Button
              disabled={
                project.status === "Initialized" ||
                project.status === "Completed"
                  ? true
                  : false
              }
              variant={"outline"}
              onClick={()=>handleProjectChange()}
              className={`h-12 ${
                project.status === "Initialized"
                  ? "text-green-400"
                  : project.status === "On Progress"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {project.status}
            </Button>
            <Button className='h-12' variant={'outline'} onClick={handleCopyProjectId}>
              Project Id : {projectId}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 md:px-16 lg:max-w-7xl lg:mx-auto py-[50px] md:py-[80px]">
        <div className="w-full">
          <Tabs defaultValue="overview" className="text-sm md:text-base w-full">
            <TabsList className="w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <ProjectOverview id={projectId} />
            </TabsContent>
            <TabsContent value="chat">
              <ProjectChat id={projectId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export default ProjectId