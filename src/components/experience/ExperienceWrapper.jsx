"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "@mui/icons-material";

const experiences = [
  {
    company: "Trueminds Innovations Ltd",
    role: "Frontend Developer Intern",
    badge: "Internship",
    date: "February 2026 – April 2026",
    color: "blue",
    tasks: [
      "Built and maintained responsive user interfaces using React.js and Tailwind CSS, ensuring consistent design across all screen sizes.",
      "Collaborated with the design and backend teams to translate Figma mockups into pixel-perfect, production-ready components.",
      "Optimized frontend performance by reducing unnecessary re-renders and improving component structure.",
      "Participated in code reviews, sprint planning, and daily standups as part of an agile development workflow.",
    ],
    tech: "React.js, Tailwind CSS, JavaScript, HTML5, CSS3, Figma",
  },
  {
    company: "Jhayfx Trading Academy",
    role: "Web Developer",
    badge: "Remote",
    date: "2024 – 2025",
    color: "teal",
    tasks: [
      "Maintained and updated the company landing page to ensure it remained active, functional, and visually aligned with brand standards.",
      "Implemented responsive design principles to ensure optimal viewing experience across all devices and screen sizes.",
      "Debugged and fixed frontend issues, improving overall performance and user experience of web pages.",
      "Collaborated with team members to understand project requirements and deliver high-quality web solutions.",
    ],
    tech: "React.js, Vue.js, Next.js, Tailwind CSS, JavaScript, TypeScript, HTML5, CSS3",
  },
];

const dotStyle = {
  blue: "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]",
  purple: "bg-purple-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]",
  teal: "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]",
};

const badgeStyle = {
  blue: "text-blue-300 border-blue-500/30 bg-blue-500/10",
  purple: "text-purple-300 border-purple-500/30 bg-purple-500/10",
  teal: "text-teal-300 border-teal-500/30 bg-teal-500/10",
};

const roleStyle = {
  blue: "text-blue-400",
  purple: "text-purple-400",
  teal: "text-teal-400",
};

const TimelineEntry = ({ experience, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pb-10 pl-8 last:pb-0"
    >
      {/* Glowing dot */}
      <span
        className={`absolute top-2 left-0 h-3 w-3 -translate-x-[6px] rounded-full ${dotStyle[experience.color]}`}
      />

      {/* Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20"
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg font-bold text-white">
                {experience.company}
              </h4>
              {experience.badge && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${badgeStyle[experience.color]}`}
                >
                  {experience.badge}
                </span>
              )}
            </div>
            <p
              className={`mt-0.5 text-sm font-medium ${roleStyle[experience.color]}`}
            >
              {experience.role}
            </p>
          </div>
          <span className="pt-1 font-mono text-xs whitespace-nowrap text-gray-400">
            {experience.date}
          </span>
        </div>

        <ul className="mb-3 space-y-1.5">
          {experience.tasks.map((task, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-300"
            >
              <ArrowRight className="mt-0.5 h-4 w-4 flex-none text-gray-500" />
              <span>{task}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-300">Stack: </span>
          {experience.tech}
        </p>
      </motion.div>
    </motion.div>
  );
};

const ExperienceWrapper = () => {
  return (
    <div className="relative mt-8 w-full px-4 md:px-0">
      {/* Vertical connecting line */}
      <div className="absolute top-2 bottom-2 left-4 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-teal-500/20 md:left-0" />

      {experiences.map((exp, i) => (
        <TimelineEntry key={exp.company} experience={exp} index={i} />
      ))}
    </div>
  );
};

export default ExperienceWrapper;
