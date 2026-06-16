"use client";

import dynamic from "next/dynamic";
import PageReveal from "@/components/PageReveal";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import StatsStrip from "@/components/StatsStrip";

const TechBackground3D = dynamic(
  () => import("@/components/TechBackground3D"),
  { ssr: false }
);

export default function Home() {
  return (
    <PageReveal>
      <TechBackground3D />
      <div className="relative z-[1] mx-auto max-w-screen-xl text-textWhite">
        <Navbar />
        <main className="overflow-hidden px-3 md:px-4">
          <HeroSection />
          <StatsStrip />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </PageReveal>
  );
}
