"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Hello 👋",
  "नमस्ते 🙏",
  "Hola 👋",
  "Ciao 👋",
  "Bonjour 👋",
  "안녕하세요 👋",
  "Olá 👋",
  "Привет 👋",
  "PRABHULAL ⚡",
];

export default function PageLoader() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  // Mark hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!hydrated) return;

    const currentMessage = messages[index];
    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    const typingSpeed = 80;

    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [index, hydrated]);

  // Progress bar animation - based on time not message count
  useEffect(() => {
    if (!hydrated) return;

    const totalDuration = 10000; // 10 seconds total
    const interval = 50;
    const increment = (interval / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [hydrated]);

  // Language cycle - infinite loop
  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      if (index < messages.length - 1) {
        setIndex(index + 1);
      } else {
        // Loop back to start
        setIndex(0);
        setCycleCount(prev => prev + 1);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [index, hydrated]);

  // Auto-hide after 2 complete cycles or 10 seconds
  useEffect(() => {
    if (!hydrated) return;

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 10000); // 10 seconds max

    return () => clearTimeout(hideTimer);
  }, [hydrated]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden">
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content container */}
      <div className="relative flex flex-col items-center gap-8 sm:gap-12 md:gap-16 px-4 sm:px-6 w-full max-w-4xl z-10">
        
        {/* Brand mark / Logo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-3xl sm:text-4xl md:text-5xl"
            >
              ⚡
            </motion.div>
          </div>
          {/* Glow effect under logo */}
          <div className="absolute inset-0 bg-white/20 blur-2xl -z-10 scale-150" />
        </motion.div>

        {/* Typing Text */}
        <div className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!hydrated && (
              <motion.div
                key="static"
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center text-white/90 px-4"
              >
                Hey👋, glad youre here 💫✨
              </motion.div>
            )}

            {hydrated && (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-center px-4"
              >
                <span className="inline-block text-white/95">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-[0.9em] bg-white/90 ml-1 align-middle"
                    />
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Section */}
        {hydrated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-md px-4 space-y-6"
          >
            {/* Status text */}
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <motion.span
                className="text-white/40 font-medium tracking-wider uppercase"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Initializing
              </motion.span>
              <span className="text-white/60 font-mono tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative">
              {/* Background track */}
              <div className="h-[2px] w-full bg-white/[0.08] rounded-full overflow-hidden relative">
                {/* Animated progress */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white/90 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Glow effect on progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
                </motion.div>

                {/* Moving shimmer */}
                <motion.div
                  className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Glow underneath progress bar */}
              <motion.div
                className="absolute inset-0 bg-white/10 blur-xl -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Loading dots indicator */}
            <div className="flex justify-center items-center gap-2 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/40"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/40" />
    </div>
  );
}