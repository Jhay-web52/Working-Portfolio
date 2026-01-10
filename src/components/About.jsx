"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "@mui/icons-material";
import about from "@/assets/about1.png";
import namastedevIcon from "@/assets/namastedev.png";
import { SiLeetcode } from "react-icons/si";

const About = () => {
  const refHeading = useRef(null);
  const refContent = useRef(null);
  const inViewHeading = useInView(refHeading);
  const inViewContent = useInView(refContent, { once: true });

  const variants1 = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

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
      <div className="mt-16 flex flex-col items-center justify-between gap-10 py-6 lg:flex-row">
        <motion.div
          ref={refContent}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.8,
            filter: "blur(10px)",
          }}
          animate={
            inViewContent
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }
              : { opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative"
        >
          <Image
            src={about}
            alt="About"
            width={300}
            height={400}
            className="size-[300px] cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:scale-[1.02] sm:size-[350px]"
            priority
          />
        </motion.div>
        <motion.div
          ref={refContent}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={
            inViewContent
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.9 }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex-1 xl:px-4"
        >
          <p>
            I&apos;m{" "}
            <span className="font-semibold text-heading">
              Prabhulal Raghwani
            </span>
            , a Frontend Developer with hands-on experience building modern,
            responsive web applications. Currently working as a Frontend
            Developer Trainee at LNV Digital, I specialize in developing
            scalable UI components and ERP modules using{" "}
            <span className="font-semibold text-heading">React.js</span>,{" "}
            <span className="font-semibold text-heading">Next.js</span>,{" "}
            <span className="font-semibold text-heading">Tailwind CSS</span>,{" "}
            <span className="font-semibold text-heading">HTML5</span>,{" "}
            <span className="font-semibold text-heading">CSS3</span>, and{" "}
            <span className="font-semibold text-heading">
              JavaScript (ES6+)
            </span>
            , with a strong focus on clean code, performance, and user
            experience.
          </p>

          <div className="mt-6 w-full sm:mt-0">
            <div className="w-full">
              <h5 className="mt-4 text-xl font-bold text-textWhite">
                Education
              </h5>
              <div className="">
                <h5 className="text-lg font-medium">Mumbai University</h5>
                <div className=" flex w-full items-start gap-1 sm:gap-2">
                  <ArrowRight className={" h-5 w-4 flex-none"} />
                  <div
                    className="flex w-full items-start justify-between gap-5 text-sm font-bold text-heading
                  "
                  >
                    <p>
                      Bachelor of Engineering (BE) – Mechanical Engineering{" "}
                      <br />
                      <small>2019 - 2021</small>
                    </p>
                    <span>GPA: 8.03/10.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full">
              <h5 className="mb-0.5 mt-2 text-xl font-bold text-textWhite">
                Certifications
              </h5>
              <div className="space-y-1.5">
                <div className="flex items-start gap-1 sm:gap-2">
                  <ArrowRight className="mt-0.5 h-5 w-4 flex-none text-blue-400" />
                  <div className="text-sm text-gray-400">
                    <a
                      href="https://www.coursera.org/account/accomplishments/professional-cert/CZ7WA8C5E4G2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-heading transition-colors hover:underline"
                    >
                      Meta Front-End Developer{" "}
                    </a>
                    - Professional certification from Meta
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2">
                  <ArrowRight className="mt-0.5 h-5 w-4 flex-none text-blue-400" />
                  <div className="text-sm text-gray-400">
                    <a
                      href="https://drive.google.com/file/d/1An7CK6iMx-pfUWmkBo7842PdzqtCTnWm/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-heading transition-colors hover:underline"
                    >
                      Namaste React Course{" "}
                    </a>
                    - Advanced React.js concepts and best practices from
                    NamasteDev.com
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 w-full">
              <h5 className="text-xl font-bold text-textWhite">
                Coding Profiles
              </h5>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href="https://leetcode.com/u/PrabhulalRaghwani/"
                  target="_blank"
                  title="Leetcode"
                  className="flex items-center gap-1 rounded-md bg-[#1d1d1d] px-3 py-2 text-sm font-medium text-orange-500 transition-all duration-200 ease-in-out hover:scale-[1.05]"
                >
                  <SiLeetcode className="size-6" /> Leetcode
                </a>
                <a
                  href="https://namastedev.com/prabhulal.raghwani410"
                  target="_blank"
                  title="NamasteDev"
                  className="flex items-center gap-1 rounded-md bg-green-800 px-3 py-2 text-sm font-medium text-orange-500 transition-all duration-200 ease-in-out hover:scale-[1.05] "
                >
                  <Image
                    src={namastedevIcon}
                    alt="NamasteDev"
                    width={40}
                    height={40}
                    className="size-6 object-cover"
                  />
                  NamasteDev
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
