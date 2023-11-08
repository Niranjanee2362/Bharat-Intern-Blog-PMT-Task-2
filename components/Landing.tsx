import React from 'react'
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

function Landing() {
  return (
    <main className="bg-[#161616] w-full h-screen">
      <div className="w-full h-full p-4 md:px-16 py-[50px] md:py-[80px] lg:max-w-5xl lg:mx-auto text-white flex gap-6 justify-center items-center flex-col text-center">
        <div className="flex flex-col gap-4 md:gap-8">
          <h1 className="text-[42px] leading-tight md:text-6xl lg:text-7xl font-bold font-outfit">
            Projects Perfected, Progress Elevated, Success Delivered
          </h1>
          <p className="text-lg font-medium">
            Our project management site is your all-in-one solution for seamless
            collaboration, efficient task tracking, and strategic planning,
            ensuring your projects not only meet deadlines but exceed
            expectations.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <Button onClick={() => signIn("google")} className="w-full">
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Landing