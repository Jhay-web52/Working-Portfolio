"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SkillCardBlock from "./skills/SkillCardBlock";
import { MySkills } from "@/constants/MySkills";

const TABS = [
  { id: "all", label: "All" },
  { id: "Programming Languages", label: "Languages" },
  { id: "Frameworks & Libraries", label: "Frameworks" },
  { id: "Databases & Backend", label: "Databases" },
  { id: "Tools & Deployment", label: "Tools" },
];

const Skills = () => {
  const refHeading = useRef(null);
  const inViewHeading = useInView(refHeading);
  const [activeTab, setActiveTab] = useState("all");

  const allSkills = MySkills.flatMap((c) => c.skills);
  const filteredSkills =
    activeTab === "all"
      ? allSkills
      : MySkills.find((c) => c.title === activeTab)?.skills ?? [];

  return (
    <section className="sm:py-[80px] sm:px-6" id="skills">
      <motion.div
        ref={refHeading}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <h3 className="gradient-heading text-3xl font-[800] sm:text-5xl">Skills</h3>
        <div className="mt-2 h-[4px] min-w-0 flex-grow bg-gradient-to-r from-blue-500/40 via-purple-500/20 to-transparent" />
      </motion.div>

      {/* Filter tabs */}
      <div className="mt-10 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="skill-tab-pill"
                className="absolute inset-0 rounded-full bg-blue-600/25 border border-blue-500/40"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={`${activeTab}-${skill.name}`}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: i * 0.03 }}
            >
              <SkillCardBlock icon={skill.icon} name={skill.name} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Skills;
