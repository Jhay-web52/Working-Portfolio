import PageReveal from "@/components/PageReveal";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import StatsStrip from "@/components/StatsStrip";

export default function Home() {
  return (
    <PageReveal>
      <div className="bg-bgDark text-textWhite relative mx-auto max-w-screen-xl">
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
