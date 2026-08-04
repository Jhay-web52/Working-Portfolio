"use client";

import { BsLinkedin, BsGithub } from "react-icons/bs";
import { HiMailOpen } from "react-icons/hi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 left-0 z-[100] flex w-full justify-center px-3 pt-5 sm:px-4"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "rgba(10, 14, 25, 0.85)"
            : "rgba(10, 14, 25, 0.6)",
          boxShadow: scrolled
            ? "0 8px 30px rgba(59,130,246,0.2)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-center gap-4 rounded-full border border-white/10 px-5 py-3 backdrop-blur-sm"
      >
        <a
          href="https://www.linkedin.com/in/joel-oguntade"
          target="_blank"
          className="text-[22px] transition hover:-translate-y-1 hover:text-blue-400"
        >
          <BsLinkedin />
        </a>
        <a
          href="https://github.com/Jhay-web52"
          target="_blank"
          className="text-[22px] transition hover:-translate-y-1 hover:text-blue-400"
        >
          <BsGithub />
        </a>
        <a
          href="mailto:joeloguntade256@gmail.com"
          target="_blank"
          className="text-[22px] transition hover:-translate-y-1 hover:text-blue-400"
        >
          <HiMailOpen />
        </a>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
