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
  const [hydrated, setHydrated] = useState(false);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Hydration
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
    const interval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [index, hydrated]);

  // Progress bar
  useEffect(() => {
    if (!hydrated) return;

    const total = 10000;
    const step = 50;
    const inc = (step / total) * 100;

    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + inc));
    }, step);

    return () => clearInterval(timer);
  }, [hydrated]);

  // Language cycle
  useEffect(() => {
    if (!hydrated) return;

    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1200);

    return () => clearTimeout(t);
  }, [index, hydrated]);

  // Auto hide
  useEffect(() => {
    if (!hydrated) return;

    const t = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(t);
  }, [hydrated]);

  // ✅ FINAL render condition
  if (!hydrated || !visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-4xl md:text-6xl font-bold text-white"
        >
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-[1em] bg-white ml-1"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
