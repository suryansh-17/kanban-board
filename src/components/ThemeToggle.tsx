"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed top-4 right-4 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/80"
        aria-label="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === "dark" ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
