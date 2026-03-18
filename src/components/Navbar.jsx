"use client";

import { BsLinkedin, BsGithub } from "react-icons/bs";
import { HiMailOpen } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { SiEbox } from "react-icons/si";
import { MenuItems } from "../constants/MenuItem";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { FaXTwitter } from "react-icons/fa6";

const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [mobileView, setMobileView] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Detect scroll */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? "rgba(10, 14, 25, 0.85)"
          : "rgba(10, 14, 25, 0)",
        boxShadow: scrolled
          ? "0 8px 30px rgba(59,130,246,0.25)"
          : "0 0 0 rgba(0,0,0,0)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative sticky left-0 top-0 z-[100] w-full"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-wrap items-center justify-between px-3 py-5 sm:px-4 md:px-8"
      >
        {/* LOGO */}
        <ScrollLink
          to="intro"
          smooth
          duration={500}
          className="min-w-[150px] cursor-pointer text-lg font-[600] tracking-wide sm:text-xl sm:font-[800]"
        >
          <span className="sm:hidden">
            @Joel{" "}
            <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </span>
          <span className="hidden sm:block">
            @Joel Oguntade{" "}
            <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </span>
        </ScrollLink>

        {/* MOBILE MENU ICON */}
        <span
          className="cursor-pointer text-[22px] lg:hidden"
          onClick={() => setMobileView(true)}
        >
          <SiEbox />
        </span>

        {/* MOBILE NAV */}
        <AnimatePresence>
          {mobileView && (
            <motion.div
              initial={{ opacity: 0, y: -200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -200 }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-0 z-50 w-full bg-bgDark"
            >
              <div className="relative p-6 sm:p-10">
                <span
                  className="absolute right-10 top-8 cursor-pointer text-[26px]"
                  onClick={() => setMobileView(false)}
                >
                  <AiFillCloseCircle />
                </span>

                {/* MOBILE LINKS */}
                <ul className="mt-10 flex flex-col items-center gap-6">
                  {MenuItems.map((item) => (
                    <li key={item.id}>
                      <ScrollLink
                        to={item.url}
                        smooth
                        duration={800}
                        spy
                        offset={-90}
                        onClick={() => setMobileView(false)}
                        className="relative cursor-pointer text-[18px] font-[500]
                        after:absolute after:-bottom-[4px] after:left-0 after:h-[3px]
                        after:w-0 after:bg-blue-400 after:transition-all
                        hover:after:w-full"
                        activeClass="after:w-full text-blue-400"
                      >
                        {item.name}
                      </ScrollLink>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DESKTOP NAV */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {MenuItems.map((item) => (
              <li key={item.id}>
                <ScrollLink
                  to={item.url}
                  smooth
                  duration={800}
                  spy
                  offset={-90}
                  className="relative cursor-pointer text-base font-[500]
                  after:absolute after:-bottom-[4px] after:left-0 after:h-[3px]
                  after:w-0 after:bg-blue-400 after:transition-all
                  hover:after:w-full"
                  activeClass="after:w-full text-blue-400"
                >
                  {item.name}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        {/* SOCIAL ICONS */}
        <div className="hidden items-center gap-3 text-[22px] lg:flex">
          <a
            href="https://www.linkedin.com/in/joel-oguntade"
            target="_blank"
            className="transition hover:-translate-y-1 hover:text-blue-400"
          >
            <BsLinkedin />
          </a>
          <a
            href="https://github.com/Jhay-web52"
            target="_blank"
            className="transition hover:-translate-y-1 hover:text-blue-400"
          >
            <BsGithub />
          </a>
        
          <a
            href="mailto:joeloguntade256@gmail.com"
            target="_blank"
            className="transition hover:-translate-y-1 hover:text-blue-400"
          >
            <HiMailOpen />
          </a>
        </div>
      </motion.div>
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-500"
      />
    </motion.nav>
  );
};

export default Navbar;
