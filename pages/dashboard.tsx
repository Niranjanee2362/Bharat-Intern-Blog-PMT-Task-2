
import CreateNewProjectDialog from '@/components/dashboard/CreateNewProjectDialog';
import ProjectsView from '@/components/dashboard/ProjectsView';

import Head from 'next/head';
import React from 'react'
import JoinProjectDialog from '@/components/dashboard/JoinProjectDialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

function Dashboard() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className="min-h-screen bg-[url('/assets/line-bg.png')] w-full font-outfit bg-app-grey-dark text-stone-200">
        <div className="p-4 md:px-16 lg:max-w-7xl lg:mx-auto">
            <div className="flex items-center sm:justify-between sm:gap-4">
              <div className="flex flex-1 items-center justify-between gap-8 sm:justify-end">
                <div className="group flex shrink-0 items-center rounded-lg transition">
                  <Image
                    alt="Photo"
                    width={100}
                    height={100}
                    src={session?.user?.image!}
                    className="h-10 w-10 rounded-full"
                  />
                  <p className="ms-2 hidden text-left text-xs sm:block">
                    <strong className="block font-bold">{session?.user?.name}</strong>
                    <span className="text-gray-500"> {session?.user?.email} </span>
                  </p>
                </div>
              </div>
              <div>
                <Button onClick={() => signOut()} variant={"ghost"} className='h-12'>
                  <LogOutIcon />
                </Button>
              </div>
            </div>
          <div className="flex flex-col md:flex-row md:justify-between mt-8 md:items-center gap-4 md:gap-0">
            <div className="">
              <span className="text-3xl font-bold md:text-5xl">Dashboard</span>

              <p className="mt-1.5 text-sm text-slate-300">
                Your Blog has seen a 52% increase in traffic in the last month.
                Keep it up! 🚀
              </p>
            </div>
            <div className="flex gap-4">
              <CreateNewProjectDialog />
              <JoinProjectDialog />
            </div>
          </div>
        </div>
        <div className="p-4 md:px-16 lg:max-w-7xl lg:mx-auto py-[50px] md:py-[80px]">
          <ProjectsView />
        </div>
      </main>
    </>
  );
}

export default Dashboard