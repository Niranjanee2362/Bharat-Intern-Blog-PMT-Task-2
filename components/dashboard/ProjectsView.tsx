import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/backend/firebase";
import { useSession } from "next-auth/react";
import Link from "next/link";


function ProjectsView
() {
  const router = useRouter();
  const [projects,setProjects] = useState<any>(null);
  const { data: session } = useSession();
  const email = session?.user?.email;
  useEffect(() => {
    if (email) {
    const unsub = onSnapshot(
      query(collection(db, "projects"), where("membersEmail", "array-contains", email)),
      (docs) => {
        const projects: any = [];
        docs.forEach((doc) => {
          projects.push({ ...doc.data(), id: doc.id });
        });
        setProjects(projects);
      }
    );
    return () => unsub();
    }
  }, [email]);
  



  console.log(projects)
  

  return (
    <section className="mt-4 font-outfit">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.length != 0 ? (
          projects &&
          projects.map((project: any) => (
            <div
              className="w-full flex flex-col gap-8 hover:-translate-y-1 transition-all duration-300 bg-app-grey-light p-4 md:p-8 rounded border border-white/10"
              key={project.id}
            >
              <div className="flex flex-col gap-4">
                <span
                  className={`rounded font-medium px-2 py-1 w-fit ${
                    project.status === "Initialized"
                      ? "bg-green-500"
                      : project.status === "On Progress"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {project.status}
                </span>
                <span className="font-semibold text-2xl capitalize">
                  {project.title}
                </span>
                <div className="text-base text-slate-300/80">
                  <p>{project.description}</p>
                </div>
              </div>
              <div>
                <Button className="h-12 w-full" asChild>
                  <Link href={`/project/${project.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xl">
            <span>No Projects Yet!, Create or Join one</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectsView;
