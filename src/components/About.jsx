"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import picture from "@/assets/IMG_2099.jpeg";

const About = () => {
  const refHeading = useRef(null);
  const refContent = useRef(null);
  const inViewHeading = useInView(refHeading);
  const inViewContent = useInView(refContent, { once: true });

  const variants1 = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

  const highlights = [
    { label: "Frontend", value: "React · Next.js · Vue · Nuxt" },
    { label: "Languages", value: "JavaScript · TypeScript · PHP" },
    { label: "Databases", value: "MySQL · PostgreSQL" },
    { label: "Styling", value: "Tailwind CSS · CSS3" },
    { label: "Tools", value: "Git · Figma · Postman" },
  ];

  return (
    <section className="py-[80px] sm:px-6" id="about">
      <motion.div
        ref={refHeading}
        variants={variants1}
        initial="initial"
        animate={inViewHeading ? "animate" : "initial"}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <h3 className="text-3xl font-[800] text-textWhite sm:text-5xl">
          About Me
        </h3>
        <div className="mt-2 h-[4px] min-w-0 flex-grow bg-textWhite"></div>
      </motion.div>

      <div className="mt-16 flex flex-col items-start justify-between gap-12 lg:flex-row">
        {/* Photo */}
        <motion.div
          ref={refContent}
          initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
          animate={
            inViewContent
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex-shrink-0 self-center lg:self-start"
        >
          <Image
            src={picture}
            alt="Joel Oguntade"
            width={300}
            height={400}
            className="rounded-full object-cover shadow-[0_0_60px_rgba(59,130,246,0.7)] sm:w-[320px]"
            priority
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inViewContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex flex-1 flex-col gap-6 xl:px-4"
        >
          {/* Bio */}
          <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
            I&apos;m{" "}
            <span className="font-semibold text-heading">Joel Oguntade</span>, a
            Frontend Developer focused on building fast, accessible, and
            visually polished web experiences. I work across the full frontend
            stack — from interactive UIs to backend-connected features — with a
            commitment to clean code and thoughtful design.
          </p>
          <p className="text-sm leading-relaxed text-gray-400">
            I&apos;ve contributed to production projects in both startup and
            training environments, and I&apos;m always looking to expand my
            depth — currently deepening my knowledge in backend development,
            databases, and system design.
          </p>

          {/* Tech highlights */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3"
              >
                <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-blue-500" />
                <div className="text-sm">
                  <span className="font-semibold text-heading">{item.label}: </span>
                  <span className="text-gray-400">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;
