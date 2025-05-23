import type React from "react";

import { motion } from "framer-motion";

interface AnimatedPageProps {
  children: React.ReactNode;
}

export function AnimatedPage({ children }: AnimatedPageProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{
        type: "spring",
        stiffness: 1020,
        damping: 40,
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
