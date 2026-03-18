import React from "react";
import { ArrowRight } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function TruemindsExperience() {
  const tasks = [
    {
      text: "Built and maintained responsive user interfaces using React.js and Tailwind CSS, ensuring consistent design across all screen sizes.",
    },
    {
      text: "Collaborated with the design and backend teams to translate Figma mockups into pixel-perfect, production-ready components.",
    },
    {
      text: "Optimized frontend performance by reducing unnecessary re-renders and improving component structure.",
    },
    {
      text: "Participated in code reviews, sprint planning, and daily standups as part of an agile development workflow.",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-between gap-3 px-4 md:px-0 lg:flex-row xl:gap-5"
      >
        <div className="flex w-full flex-col space-y-3">
          <div className="flex flex-col space-y-2">
            {/* Title */}
            <div className="flex items-center justify-between">
              <span className="text-base font-medium tracking-wide text-gray-100 sm:text-2xl">
                Frontend Developer Intern
              </span>
              <span className="text-sm">Internship</span>
            </div>

            <div className="flex flex-col items-start justify-between font-mono text-sm font-bold text-heading sm:flex-row sm:items-center sm:text-base">
              {/* Company name */}
              <span>Trueminds Innovations Ltd</span>

              {/* Date */}
              <span>2026</span>
            </div>
          </div>

          <div className="flex flex-col space-y-1 text-sm sm:text-base">
            {tasks.map((item, index) => (
              <div key={index} className="flex flex-row space-x-2">
                <ArrowRight className="h-5 w-4 flex-none" />
                <span>{item.text}</span>
              </div>
            ))}

            <div className="flex flex-row space-x-2">
              <ArrowRight className="h-5 w-4 flex-none" />
              <span className="font-bold text-heading">
                Technologies used: React.js, Tailwind CSS, JavaScript, HTML5, CSS3, Figma.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
