import { ArrowRight } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

const LeftView = ({ id, name, description, img, tech, source, demo }) => {
  const refContent = useRef(null);
  const inViewContent = useInView(refContent);

  return (
    <div className="mt-[80px] grid grid-cols-1 md:px-10 xl:mt-[120px] xl:grid-cols-12">
      <motion.div
        ref={refContent}
        initial={{ opacity: 0, x: -50 }} // Invisible at start , 50px left (LeftView) or 50px right (RightView)
        animate={inViewContent && { opacity: 1, x: 0 }} // Final position and visibility
        viewport={{
          once: true,
          amount: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative order-2 col-span-12 flex w-full flex-col items-start lg:col-span-7 xl:order-1"
      >
        {/* project tagline */}
        <div
          className={`w-full px-3 py-2 text-left text-3xl font-[600] transition-all duration-300 ease-in-out lg:py-0`}
        >
          <h3 className="text-heading font-bold">{name}</h3>
        </div>
        {/* description absolute */}
        <div className="group bg-bgDark top-[40px] left-0 z-10 mt-1 w-full rounded-lg border border-white/5 p-4 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 lg:absolute lg:w-[450px]">
          {description.map((item, i) => (
            <div
              key={i}
              className="mb-2 flex items-start gap-1 last:mb-0 sm:gap-2"
            >
              <ArrowRight className={"h-5 w-4 flex-none text-[#31d1d1]"} />
              <div className="text-textWhite text-sm leading-relaxed">
                <p>{item}</p>
              </div>
            </div>
          ))}
        </div>
        {/* tech stack */}
        <div className="text-heading mt-4 flex flex-wrap items-center gap-2 text-xs font-medium md:gap-3 md:text-sm lg:mt-[180px]">
          {tech?.map((item, i) => {
            return (
              <span
                key={i}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors duration-200 hover:border-[#31d1d1]/40 hover:bg-[#31d1d1]/10 hover:text-[#31d1d1]"
              >
                {item}
              </span>
            );
          })}
        </div>
        {/* links */}
        <div className="mt-5 flex w-full items-center justify-start gap-10 text-sm font-[500]">
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className="group text-textLight relative flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-white"
            >
              <GitHubIcon className="animate-pulse group-hover:animate-none" />
              <span className="bg-bgDark absolute top-[150%] left-[50%] w-[90px] translate-x-[-50%] translate-y-[-50%] rounded border border-white/10 px-2 py-1 text-[10px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                Source Code
              </span>
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className="group relative flex cursor-pointer flex-col items-center gap-1 text-[#31d1d1] transition-colors hover:text-[#31d1d1]/80"
            >
              <LaunchIcon className="animate-pulse group-hover:animate-none" />
              <span className="bg-bgDark absolute top-[150%] left-[50%] w-fit translate-x-[-50%] translate-y-[-50%] rounded border border-[#31d1d1]/20 px-2 py-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                Live Demo
              </span>
            </a>
          )}
        </div>
      </motion.div>
      {/* project image */}
      <div className="order-1 col-span-12 mt-4 flex justify-end transition-all duration-700 ease-in-out hover:z-20 hover:scale-[1.02] lg:col-span-5 lg:mt-0 xl:order-2 xl:self-start xl:justify-self-end">
        <a
          href={demo || source}
          target="_blank"
          rel="noreferrer"
          className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50 lg:h-[260px] lg:w-[420px]"
        >
          {img && (
            <Image
              fill
              src={img}
              alt={name}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="text-xs font-bold tracking-widest text-white uppercase">
              {demo ? "View Live Site" : "View Source"}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default LeftView;
