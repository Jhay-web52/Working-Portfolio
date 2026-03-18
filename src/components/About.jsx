"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "@mui/icons-material";
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
            src={picture}
            alt="About"
            width={300}
            height={400}
            className="rounded-full object-cover shadow-[0_0_60px_rgba(59,130,246,0.7)] sm:w-[360px] hover:scale-100"
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
              Joel Oguntade
            </span>
            , a passionate Frontend Developer with a strong foundation in modern web technologies. I specialize in building responsive, user-centric interfaces using{" "}
            <span className="font-semibold text-heading">React.js</span>,{" "}
            <span className="font-semibold text-heading">Vue.js</span>,{" "}
            <span className="font-semibold text-heading">Next.js</span>,{" "}
            <span className="font-semibold text-heading">Nuxt.js</span>,{" "}
            <span className="font-semibold text-heading">Tailwind CSS</span>, and{" "}
            <span className="font-semibold text-heading">
              TypeScript
            </span>
            , with a strong focus on clean code, performance optimization, and exceptional user experience.
          </p>

          <div className="mt-6 w-full sm:mt-0">
            <div className="w-full">
              <h5 className="mt-4 text-xl font-bold text-textWhite">
                Professional Experience
              </h5>
              <div className="">
                <h5 className="text-lg font-medium">Jhayfx Trading Academy</h5>
                <div className=" flex w-full items-start gap-1 sm:gap-2">
                  <ArrowRight className={" h-5 w-4 flex-none"} />
                  <div
                    className="flex w-full items-start justify-between gap-5 text-sm font-bold text-heading
                  "
                  >
                    <p>
                      Web Developer <br />
                      <small>2024 - 2025</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full">
              <h5 className="mb-0.5 mt-2 text-xl font-bold text-textWhite">
                Skills
              </h5>
              <div className="space-y-1.5">
                <div className="flex items-start gap-1 sm:gap-2">
                  <ArrowRight className="mt-0.5 h-5 w-4 flex-none text-blue-400" />
                  <div className="text-sm text-gray-400">
                    <span className="font-bold text-heading">Frontend Frameworks: </span>React.js, Vue.js, Next.js, Nuxt.js
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2">
                  <ArrowRight className="mt-0.5 h-5 w-4 flex-none text-blue-400" />
                  <div className="text-sm text-gray-400">
                    <span className="font-bold text-heading">Styling: </span>Tailwind CSS, CSS3, Responsive Design
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2">
                  <ArrowRight className="mt-0.5 h-5 w-4 flex-none text-blue-400" />
                  <div className="text-sm text-gray-400">
                    <span className="font-bold text-heading">Languages: </span>JavaScript, TypeScript, HTML5
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2">
                  <ArrowRight className="mt-0.5 h-5 w-4 flex-none text-blue-400" />
                  <div className="text-sm text-gray-400">
                    <span className="font-bold text-heading">Tools & Version Control: </span>Git, GitHub, Figma
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
