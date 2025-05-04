"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`rounded-full ${className}`}
            aria-label="Toggle theme"
        >
            <motion.div
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative w-5 h-5"
            >
                <motion.div
                    initial={false}
                    animate={{
                        opacity: theme === "dark" ? 0 : 1,
                        scale: theme === "dark" ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                >
                    <Sun className="w-5 h-5 text-yellow-500" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        opacity: theme === "dark" ? 1 : 0,
                        scale: theme === "dark" ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                >
                    <Moon className="w-5 h-5 text-slate-300" />
                </motion.div>
            </motion.div>
        </Button>
    );
}