import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import CompaniesBar from "./CompaniesBar";
import LnvDigitalExperience from "./LnvDigitalExperience";
import ADDigitech from "./ADDigitech";

const ExperienceWrapper = () => {
  const [DescriptionJob, setDescriptionJob] =
    React.useState("LnvDigitalExperience");

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

      {/* Animated content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={DescriptionJob}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {GetDescription()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExperienceWrapper;
