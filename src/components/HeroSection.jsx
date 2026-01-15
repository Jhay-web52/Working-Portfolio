"use client";

import { TypeAnimation } from "react-type-animation";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import linkdinimg from "@/assets/linkdinimg.jpeg";
import { FaDownload, FaArrowRight } from "react-icons/fa";

/* Floating animation (desktop only) */
const floating = {
  animate: { y: [0, -12, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export default function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  /* Mouse glow */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 18 });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);

    if (window.innerWidth >= 1024) {
      const move = (e) => {
        mouseX.set(e.clientX - 150);
        mouseY.set(e.clientY - 150);
      };
      window.addEventListener("mousemove", move);

      return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("resize", check);
      };
    }

    return () => window.removeEventListener("resize", check);
  }, [mouseX, mouseY]);

  return (
    <section
      id="intro"
      className="relative min-h-screen overflow-hidden px-4 pt-24 sm:px-6"
    >
      {/* ===== Animated Gradient Background ===== */}
      <motion.div
        className="absolute inset-0 -z-30"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(120deg, rgba(59,130,246,0.14), rgba(147,51,234,0.14), rgba(59,130,246,0.14))",
          backgroundSize: "300% 300%",
        }}
      />

      {/* ===== GRID OVERLAY (VISIBLE) ===== */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black 0%, black 45%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, black 45%, transparent 75%)",
        }}
      />

      {/* ===== Mouse Glow ===== */}
      {isDesktop && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-0 h-72 w-72 rounded-full bg-blue-500/25 blur-[140px]"
          style={{
            translateX: smoothX,
            translateY: smoothY,
          }}
        />
      )}

      <div className="relative z-20 mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 lg:flex-row">
        {/* ===== LEFT CONTENT ===== */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl xl:text-6xl">
            Hi, I’m{" "}
            <span className="text-heading drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]">
              Prabhulal
            </span>
            <br />
            Frontend Developer
          </h1>

          <TypeAnimation
            sequence={[
              "Building premium UI with React & Next.js",
              1200,
              "Crafting smooth, scalable frontend experiences",
              1200,
              "Turning ideas into production-ready code",
              1200,
            ]}
            speed={45}
            repeat={Infinity}
            className="text-sm text-textPara sm:text-lg"
          />

          <p className="mx-auto mt-4 max-w-xl text-textPara lg:mx-0">
            I build modern, high-performance web interfaces with a strong focus
            on motion, accessibility, and clean architecture.
          </p>

          {/* ===== CTA BUTTONS ===== */}
          <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            {/* View Projects */}
            <ScrollLink
              to="projects"
              smooth
              spy
              offset={-80}
              duration={800}
              role="button"
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-3 font-bold text-darkHover shadow-xl sm:w-auto"
              >
                View Projects
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </motion.div>
            </ScrollLink>

            {/* Download CV */}
            <motion.a
              href="https://drive.google.com/file/d/1wRgaFmytWUjihBWk56ehBRhDMdr4abE3/view"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-white px-8 py-3 font-medium text-white sm:w-auto"
            >
              Download CV
              <FaDownload />
            </motion.a>
          </div>
        </motion.div>

        {/* ===== IMAGE ===== */}
        <motion.div
          variants={isDesktop ? floating : {}}
          animate={isDesktop ? "animate" : undefined}
          className="relative"
        >
          <Image
            src={linkdinimg}
            alt="Prabhulal"
            width={320}
            height={320}
            priority
            className="rounded-full object-cover shadow-[0_0_60px_rgba(59,130,246,0.7)] sm:w-[360px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
