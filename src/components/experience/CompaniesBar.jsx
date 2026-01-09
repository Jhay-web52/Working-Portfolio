import React from "react";
import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

const CompaniesBar = ({ setDescriptionJob }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const companies = [
    {
      name: "LNV Digital Systems",
      job: "LnvDigitalExperience",
    },
    {
      name: "AD Digitech",
      job: "ADDigitech",
    },
  ];

  // Positions → 0% and 50% (your requirement)
  const positions = ["0%", "50%"];

  return (
    <div className="relative flex w-full lg:w-[360px] min-h-[300px]">
      {/* Timeline */}
      <div className="relative w-10 flex justify-center">
        {/* Base line */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-gray-700/40" />

        {/* Animated progress line */}
        <motion.div
          animate={{ height: activeIndex === 0 ? "20%" : "60%" }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 w-[2px] bg-blue-500"
        />

        {/* Timeline dots */}
        {companies.map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: positions[index] }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`h-4 w-4 rounded-full border-2 ${
                  isActive
                    ? "bg-blue-500 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.7)]"
                    : "bg-background border-gray-500"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Company Cards */}
      <div className="relative flex-1">
        {companies.map((company, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={company.name}
              onClick={() => {
                setActiveIndex(index);
                setDescriptionJob(company.job);
              }}
              whileHover={{ x: 6 }}
              className={`absolute w-full max-w-[300px] rounded-xl px-5 py-4 text-left transition-all
                ${
                  isActive
                    ? "bg-blue-500/10 border border-blue-500/40"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              style={{ top: positions[index] }}
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-blue-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <FaBriefcase
                  className={`text-sm ${
                    isActive ? "text-blue-400" : "text-gray-400"
                  }`}
                />
              </div>

              <h4
                className={`mt-2 text-lg font-semibold ${
                  isActive ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {company.name}
              </h4>

              <p className="text-sm text-gray-400">
                Click to view experience
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CompaniesBar;
