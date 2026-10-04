"use client";

import { TypeAnimation } from "react-type-animation";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import picture from "@/assets/IMG_2099.jpeg";

// Three.js is heavy, so the globe is loaded only on the client and only on desktop.
const HeroGlobe = dynamic(() => import("./hero/HeroGlobe"), { ssr: false });
import {
  FaDownload,
  FaCertificate,
  FaChevronDown,
  FaFileAlt,
} from "react-icons/fa";

/* Floating animation (desktop only) */
const floating = {
  animate: { y: [0, -12, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export default function HeroSection() {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true });

  /* Scroll-linked motion: text drifts up and fades, the globe turns and grows */
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  /* Mouse glow */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 18 });

  const [isDesktop, setIsDesktop] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  const certificates = [
    { label: "AltSchool Africa Certificate", file: "/certificate.pdf" },
    { label: "AltSchool Africa Transcript", file: "/transcript.pdf" },
    {
      label: "Trueminds Innovations Certificate",
      file: "/trueminds-certificate.pdf",
    },
  ];

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
      ref={sectionRef}
      className="relative z-0 min-h-screen overflow-hidden px-4 pt-24 sm:px-6"
    >
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

      {/* ===== GLOBE BACKDROP (desktop only) ===== */}
      {isDesktop && !reduceMotion && (
        <motion.div
          style={{ y: globeY, scale: globeScale }}
          className="pointer-events-none absolute top-24 right-[-18%] z-10 h-[min(85vh,760px)] w-[min(85vh,760px)] opacity-80 xl:right-[-6%]"
        >
          <HeroGlobe progress={scrollYProgress} />
        </motion.div>
      )}

      <div className="relative z-20 mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 lg:flex-row">
        {/* ===== LEFT CONTENT (fades and drifts on scroll) ===== */}
        <motion.div
          style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
          className="w-full flex-1"
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl xl:text-6xl">
              Hi, I&apos;m{" "}
              <span className="text-heading drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]">
                Joel Oguntade
              </span>
              <br />
              Full-Stack Developer
            </h1>

            <TypeAnimation
              sequence={[
                "Building interfaces with React & Next.js",
                1200,
                "Crafting smooth, scalable web experiences",
                1200,
                "Turning ideas into production-ready code",
                1200,
              ]}
              speed={45}
              repeat={Infinity}
              className="text-textPara text-sm sm:text-lg"
            />

            <p className="text-textPara mx-auto mt-4 max-w-xl lg:mx-0">
              I build production web and mobile apps in TypeScript, React,
              Next.js, and Node.js, from Figma handoff through to deployment.
              Currently leading development on ClariFi NG.
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
                  className="text-darkHover inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-3 font-bold shadow-xl sm:w-auto"
                >
                  View Projects
                </motion.div>
              </ScrollLink>

              {/* Download CV */}
              <motion.a
                href="/Joel_Oguntade_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-white px-8 py-3 font-medium text-white sm:w-auto"
              >
                Download CV
                <FaDownload />
              </motion.a>

              {/* View Certificates Dropdown */}
              <div className="relative w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCertOpen((v) => !v)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-blue-400 px-8 py-3 font-medium text-blue-400 sm:w-auto"
                >
                  <FaCertificate />
                  View Certificates
                  <FaChevronDown
                    className={`transition-transform duration-200 ${certOpen ? "rotate-180" : ""}`}
                  />
                </motion.button>

                {certOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="z-50 mt-2 w-full min-w-[280px] rounded-xl border border-white/10 bg-[#1a1a2e] shadow-xl sm:absolute sm:right-0 sm:left-auto"
                  >
                    {certificates.map((cert) => (
                      <a
                        key={cert.file}
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setCertOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <FaFileAlt className="flex-none text-blue-400" />
                        {cert.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ===== IMAGE ===== */}
        <motion.div
          variants={isDesktop ? floating : {}}
          animate={isDesktop ? "animate" : undefined}
          className="relative"
        >
          <div className="relative">
            <Image
              src={picture}
              alt="Joel Oguntade"
              width={320}
              height={320}
              className="rounded-full object-cover shadow-[0_0_60px_rgba(59,130,246,0.7)] sm:w-[360px]"
              priority
            />

            {/* Floating tech badges (desktop only) */}
            {isDesktop && (
              <>
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 -left-12 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur-sm"
                >
                  React.js
                </motion.span>
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-8 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur-sm"
                >
                  Next.js
                </motion.span>
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-2 -left-10 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur-sm"
                >
                  Vue.js
                </motion.span>
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-0 -bottom-4 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur-sm"
                >
                  TypeScript
                </motion.span>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
