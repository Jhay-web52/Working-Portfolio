/* eslint-disable react/prop-types */
import { ArrowRight } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

const RightView = ({ id, name, description, img, tech, source, demo }) => {
  const refContent = useRef(null);
  const inViewContent = useInView(refContent);

  return (
    <div className="mt-[80px] grid grid-cols-1 md:px-10 lg:mt-[120px] xl:grid-cols-12">
      <motion.div
        ref={refContent}
        initial={{ opacity: 0, filter: "blur(6px) brightness(50%)" }}
        animate={
          inViewContent
            ? { opacity: 1, filter: "blur(0px) brightness(100%)" }
            : { opacity: 1, filter: "blur(6px) brightness(50%)" }
        }
        transition={{ duration: 1 }}
        className="col-span-12 lg:col-span-5 w-full brightness-50 transition-all duration-700 ease-in-out hover:z-20 hover:scale-[1.02] hover:brightness-100 flex justify-start"
      >
        <a
          href={demo}
          target="_blank"
          className="relative group block w-full aspect-video lg:w-[420px] lg:h-[260px] overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50"
        >
          {img && (
            <Image
              fill
              src={img}
              alt={name}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <span className="text-white text-xs font-bold uppercase tracking-widest">View Live Site</span>
          </div>
        </a>
      </motion.div>
      <motion.div
        ref={refContent}
        initial={{ opacity: 0, x: 50 }}
        animate={inViewContent && { opacity: 1, x: 0 }}
        viewport={{
          once: true,
          amount: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative col-span-12 lg:col-span-7 flex w-full flex-col items-end mt-4 lg:mt-0"
      >
        {/* project tagline */}
        <div
          className={`w-full px-3 py-2 text-right text-3xl font-[600] transition-all duration-300 ease-in-out lg:py-0`}
        >
          <h3 className="text-heading font-bold">{name}</h3>
        </div>
        {/* description absolute */}
        <div className="group right-0 top-[40px] z-10 mt-1 w-full rounded-lg bg-bgDark shadow-xl shadow-black/20 p-4 border border-white/5 lg:absolute lg:w-[450px]">
          {description?.map((item, i) => (
            <div key={i} className="flex items-start gap-1 sm:gap-2 mb-2 last:mb-0">
              <ArrowRight className={" h-5 w-4 flex-none text-[#31d1d1]"} />
              <div className="text-sm text-textWhite leading-relaxed">
                <p>{item}</p>
              </div>
            </div>
          ))}
        </div>
        {/* tech stack */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-xs text-heading font-medium md:gap-3 md:text-sm lg:mt-[180px] ">
          {tech?.map((item, i) => {
            return (
              <span key={i} className="px-2 py-1 bg-white/5 rounded-md border border-white/10 uppercase tracking-wider text-[10px]">
                {item}
              </span>
            );
          })}
        </div>
        {/* links */}
        <div className="mt-5 flex w-full items-center justify-end gap-8 text-sm font-[500]">
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className="group relative flex cursor-pointer items-center gap-1 text-textLight hover:text-white transition-colors"
            >
              <GitHubIcon className="animate-pulse group-hover:animate-none" />
              <span className="absolute -left-[135%] top-7 w-[90px] whitespace-nowrap px-2 text-[10px] bg-bgDark border border-white/10 rounded py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Source Code
              </span>
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className="group relative flex cursor-pointer items-center gap-2 text-[#31d1d1] hover:text-[#31d1d1]/80 transition-colors"
            >
              <LaunchIcon className="animate-pulse group-hover:animate-none" />
              <span className="absolute -left-[60%] top-7 w-fit px-2 text-[10px] bg-bgDark border border-[#31d1d1]/20 rounded py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Live Demo
              </span>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RightView;
