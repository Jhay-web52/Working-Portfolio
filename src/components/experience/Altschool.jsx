import React from "react";
import { ArrowRight } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function ADDigitech() {
  const tasks = [
    {
      text: "Developed responsive and interactive web applications using React.js and modern JavaScript frameworks.",
    },
    {
      text: "Collaborated with backend developers to integrate APIs and ensure seamless frontend-backend communication.",
    },
    {
      text: "Implemented state management solutions and optimized component performance for better user experience.",
    },
    {
      text: "Participated in code reviews and best practices discussions to maintain code quality and scalability.",
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
        <div className="flex w-full flex-col space-y-3 lg:max-w-xl xl:max-w-2xl">
          <div className="flex flex-col space-y-2">
            {/* Title */}
            <span className="text-base font-medium tracking-wide text-gray-100 sm:text-2xl">
              Frontend Engineer
            </span>

            <div className="flex flex-col items-start justify-between font-mono text-sm font-bold text-heading sm:flex-row sm:items-center sm:text-base">
              {/* Company name */}
              <span>Altschool Africa</span>

              {/* Date */}
              <span>March 2025 – March 2026</span>
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
                Technologies used: React.js, Next.js, JavaScript, Tailwind CSS, TypeScript, REST APIs.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
