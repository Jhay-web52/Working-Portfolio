import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CompaniesBar from "./CompaniesBar";
import LnvDigitalExperience from "./LnvDigitalExperience";
import ADDigitech from "./ADDigitech";

const ExperienceWrapper = () => {
  const [DescriptionJob, setDescriptionJob] = useState("LnvDigitalExperience");

  const GetDescription = () => {
    switch (DescriptionJob) {
      case "LnvDigitalExperience":
        return <LnvDigitalExperience />;
      case "ADDigitech":
        return <ADDigitech />;
      default:
        return null;
    }
  };

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
            initial={{ opacity: 0, y: 20 }}//Starts invisible
            animate={{ opacity: 1, y: 0 }}//Fully visible
            exit={{ opacity: 0, y: -20 }}//Fades out
            transition={{ duration: 0.4 }}//Animation lasts 0.4 seconds
          >
            {GetDescription()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExperienceWrapper;
