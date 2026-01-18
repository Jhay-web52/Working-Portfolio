"use client";

import { useState, useEffect } from "react";
import PageLoader from "@/components/PageLoader";
import PageReveal from "@/components/PageReveal";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // lock scroll
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setShowContent(true);
      document.body.style.overflow = "auto";
    }, 6000); // MUST match PageLoader duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!showContent && <PageLoader />}

      {showContent && (
        <PageReveal>
          <main className="relative mx-auto max-w-screen-xl bg-bgDark text-textWhite">
            <Navbar />
            <main className="overflow-hidden px-3 md:px-4">
              <HeroSection />
              <About />
              <Experience />
              <Skills />
              <Projects />
              <Contact />
            </main>
          </main>
        </PageReveal>
      )}
    </>
  );
}
