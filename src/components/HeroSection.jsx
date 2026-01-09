"use client";

import { TypeAnimation } from "react-type-animation";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import linkdinimg from "@/assets/linkdinimg.jpeg";
import { FaDownload, FaArrowRight } from "react-icons/fa";

/* ------------------ FLOATING ANIMATION ------------------ */
const floating = {
  animate: { y: [0, -14, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

const HeroSection = () => {
  const refContent = useRef(null);
  const inView = useInView(refContent, { once: true });

  /* ------------------ MOUSE GLOW ------------------ */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section
      id="intro"
      className="relative min-h-screen w-full overflow-hidden px-4 pt-20 sm:px-6"
    >
      {/* 🌊 Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-20"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(120deg, rgba(59,130,246,0.15), rgba(147,51,234,0.15), rgba(59,130,246,0.15))",
          backgroundSize: "300% 300%",
        }}
      />

      {/* 🎯 Mouse Follow Glow (Desktop Only) */}
      {isDesktop && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]"
          style={{
            translateX: smoothX,
            translateY: smoothY,
          }}
        />
      )}

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row">
        {/* ---------------- LEFT CONTENT ---------------- */}
        <motion.div
          ref={refContent}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl xl:text-6xl">
            I&apos;m <span className="text-heading drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]">Prabhulal</span>, a{' '}
            <span className="text-heading drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]">passionate</span> frontend developer
          </h1>

          <TypeAnimation
            sequence={[
              "Building premium UI with React & Next.js",
              1200,
              "Creating smooth, scalable frontend experiences",
              1200,
              "Turning ideas into production-ready code",
              1200,
            ]}
            speed={45}
            repeat={Infinity}
            className="text-base text-textPara md:text-xl"
          />

          <p className="mt-4 max-w-xl text-textPara">
            I design and build modern, high-performance web interfaces focused on clarity, motion and user experience.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col gap-5 sm:flex-row">
            {/* Hire Me */}
            <motion.div variants={floating} animate="animate" className="flex items-center">
              <ScrollLink
                to="contact"
                smooth
                duration={900}
                className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-white px-8 py-3 font-bold text-darkHover shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1"
              >
                Hire Me
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  <FaArrowRight />
                </motion.span>
              </ScrollLink>
            </motion.div>

            {/* 💎 Download CV */}
            <motion.a
              href="https://drive.google.com/file/d/1wRgaFmytWUjihBWk56ehBRhDMdr4abE3/view"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-full border-2 border-white px-8 py-3 font-medium text-white transition-all hover:bg-white hover:text-darkHover"
            >
              <span>Download CV</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <FaDownload />
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* ---------------- IMAGE ---------------- */}
        <motion.div variants={floating} animate="animate" className="relative">
          <motion.div whileHover={{ scale: 1.06, rotate: 2 }}>
            <Image
              src={linkdinimg}
              alt="Prabhulal"
              width={380}
              height={380}
              priority
              className="relative rounded-full object-cover shadow-[0_0_45px_rgba(59,130,246,0.6)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;