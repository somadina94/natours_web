"use client";

import { motion } from "framer-motion";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-md"
    >
      {children}
    </motion.div>
  );
}
