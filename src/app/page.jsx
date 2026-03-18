"use client";

import PageReveal from "@/components/PageReveal";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <PageReveal>
      <div className="relative mx-auto max-w-screen-xl bg-bgDark text-textWhite">
        <Navbar />
        <main className="overflow-hidden px-3 md:px-4">
          <HeroSection />
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
