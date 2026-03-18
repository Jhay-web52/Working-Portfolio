"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 2, label: "Years Experience", suffix: "+" },
  { target: 10, label: "Projects Built", suffix: "+" },
  { target: 3, label: "Companies", suffix: "" },
  { target: 5, label: "Technologies", suffix: "+" },
];

function CountUp({ target, suffix, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const duration = 1500;
    const steps = 30;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [trigger, target]);

  return (
    <span className="text-heading text-3xl font-extrabold sm:text-4xl">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mx-auto my-16 grid max-w-5xl grid-cols-2 gap-4 px-4 sm:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/[0.03] px-6 py-6 text-center"
        >
          <CountUp target={stat.target} suffix={stat.suffix} trigger={inView} />
          <span className="text-sm text-gray-400">{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
