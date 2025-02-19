"use client";
import React from "react";
import Image from "next/image";
import About from "@/components/slider";
import VoteList from "@/components/fr";
import AboutDeveloper from "@/components/AboutDeveloper";
import Rating from "@/components/liste";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen pt-24 pb-20">
      <section id="home">
        <About />
      </section>
      
      <section id="rat" >
      <Rating/>
        <VoteList /> {/* يحتوي على كل الأقسام: Rating, VoteForm, LastVotes */}
      </section>

      <section id="aboutdev" >
        <AboutDeveloper />
      </section>
    </div>
  );
}
