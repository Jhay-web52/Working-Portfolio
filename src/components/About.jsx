"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import picture from "@/assets/IMG_2099.jpeg";
import { FaGraduationCap, FaCode } from "react-icons/fa";

const BentoCard = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const refHeading = useRef(null);
  const inViewHeading = useInView(refHeading, { once: true, amount: 0.3 });

  return (
    <section className="py-[80px] sm:px-6" id="about">
      <motion.div
        ref={refHeading}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <h3 className="gradient-heading text-3xl font-[800] sm:text-5xl">
          About Me
        </h3>
        <div className="mt-2 h-[4px] min-w-0 flex-grow bg-gradient-to-r from-blue-500/40 via-purple-500/20 to-transparent" />
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Bio card – 2 cols on lg */}
        <BentoCard delay={0.1} className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <Image
              src={picture}
              alt="Joel Oguntade"
              width={72}
              height={72}
              className="h-16 w-16 flex-shrink-0 rounded-full object-cover shadow-[0_0_20px_rgba(59,130,246,0.5)] sm:h-[72px] sm:w-[72px]"
              priority
            />
            <div>
              <h4 className="text-lg font-bold text-white">Joel Oguntade</h4>
              <p className="mb-2 text-sm text-blue-400">Frontend Developer</p>
              <p className="text-sm leading-relaxed text-gray-300">
                I build production-ready interfaces with a strong focus on
                performance, accessibility, and design fidelity. My journey
                began at{" "}
                <span className="font-medium text-gray-100">
                  AltSchool Africa
                </span>{" "}
                where I graduated as a Frontend Engineer, then deepened my
                academic background studying Computing at the{" "}
                <span className="font-medium text-gray-100">
                  University of Sunderland
                </span>
                .
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Quick stats card */}
        <BentoCard delay={0.15} className="flex flex-col justify-between gap-4">
          <p className="text-xs tracking-wider text-gray-400 uppercase">
            At a glance
          </p>
          {[
            { value: "1+", label: "Years experience" },
            { value: "9+", label: "Projects shipped" },
            { value: "3", label: "Companies" },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </BentoCard>

        {/* AltSchool card */}
        <BentoCard
          delay={0.2}
          className="border-blue-500/20 bg-blue-500/[0.03]"
        >
          <div className="mb-3 flex items-center gap-2">
            <FaGraduationCap className="text-blue-400" />
            <span className="text-xs tracking-wider text-gray-400 uppercase">
              Education
            </span>
          </div>
          <h5 className="font-semibold text-white">AltSchool Africa</h5>
          <p className="mt-0.5 text-sm text-blue-400">Frontend Engineering</p>
          <p className="mt-0.5 text-xs text-gray-500">
            March 2025 – March 2026
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            Graduated with a strong focus on modern frontend development, UI
            engineering, and production-ready React applications.
          </p>
        </BentoCard>

        {/* Sunderland card */}
        <BentoCard
          delay={0.25}
          className="border-purple-500/20 bg-purple-500/[0.03]"
        >
          <div className="mb-3 flex items-center gap-2">
            <FaGraduationCap className="text-purple-400" />
            <span className="text-xs tracking-wider text-gray-400 uppercase">
              Education
            </span>
          </div>
          <h5 className="font-semibold text-white">University of Sunderland</h5>
          <p className="mt-0.5 text-sm text-purple-400">MSc Computing</p>
          <p className="mt-0.5 text-xs text-gray-500">Postgraduate</p>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            Deepened understanding of software systems, problem solving, and
            engineering principles at a broader level.
          </p>
        </BentoCard>

        {/* FlashPromote card */}
        <BentoCard
          delay={0.3}
          className="border-green-500/20 bg-green-500/[0.03]"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-xs tracking-wider text-gray-400 uppercase">
              Currently building
            </span>
          </div>
          <div className="flex items-start gap-2">
            <FaCode className="mt-0.5 flex-shrink-0 text-green-400" />
            <div>
              <h5 className="font-semibold text-white">FlashPromote</h5>
              <p className="mt-0.5 text-sm text-green-400">
                Influencer Marketing SaaS
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                A platform connecting brands with creators. Built with React,
                TypeScript, Supabase, Stripe, and Resend — covering campaign
                management, creator marketplaces, and end-to-end payments.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  );
};

export default About;
