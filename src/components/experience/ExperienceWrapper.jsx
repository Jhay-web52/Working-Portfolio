import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CompaniesBar from "./CompaniesBar";
import JhayfxExperience from "./JhayfxExperience";
import Altschool from "./Altschool";
import TruemindsExperience from "./TruemindsExperience";
const ExperienceWrapper = () => {
  const [DescriptionJob, setDescriptionJob] = useState("JhayfxExperience");

  const GetDescription = () => {
    switch (DescriptionJob) {
      case "JhayfxExperience":
        return <JhayfxExperience />;
      case "AltschoolExperience":
        return <Altschool />;
      case "TruemindsExperience":
        return <TruemindsExperience />;
      default:
        return null;
    }
  };

  const companies = [
    {
      name: "Jhayfx Trading Academy",
      job: "JhayfxExperience",
    },
    {
      name: "Altschool Africa",
      job: "AltschoolExperience",
    },
    {
      name: "Trueminds Innovations Ltd",
      job: "TruemindsExperience",
    },
  ];

  return (
    <section className="flex w-full flex-col lg:flex-row gap-12">
      <CompaniesBar setDescriptionJob={setDescriptionJob} />

      {/* [ Old Experience ] animation flow
          ↓ fade out + up
            (0.4s)
          [ New Experience ]
            ↑ fade in + up
            (0.4s) */}

      {/* Animated content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={DescriptionJob}
            initial={{ opacity: 0, y: 20 }} //Starts invisible
            animate={{ opacity: 1, y: 0 }} //Fully visible
            exit={{ opacity: 0, y: -20 }} //Fades out
            transition={{ duration: 0.4 }} //Animation lasts 0.4 seconds
          >
            {GetDescription()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExperienceWrapper;
