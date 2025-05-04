"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PageBranding: FC = () => {
    return (
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative w-9 h-9 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/20 transition-shadow">
                            <motion.span
                                className="text-white font-bold text-lg"
                                initial={{ y: 0 }}
                                whileHover={{ y: -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                R
                            </motion.span>
                            <motion.span
                                className="text-white font-bold text-lg absolute"
                                initial={{ y: 30 }}
                                whileHover={{ y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                $
                            </motion.span>
                        </div>
                        <div className="overflow-hidden">
                            <motion.span
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent inline-block"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                RealPayTag
                            </motion.span>
                        </div>
                    </Link>

                    <nav>
                        <ul className="flex space-x-6 items-center">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                                >
                                    Help
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default PageBranding;