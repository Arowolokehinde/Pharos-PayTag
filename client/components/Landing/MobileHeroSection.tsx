"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WalletConnect from "@/components/auth/wallet-connect";
import {
    PiggyBank,
    Users,
    Tag,
    Building,
    Smartphone,
    Lock,
    ChevronRight
} from "lucide-react";

const MobileHeroSection: FC = () => {
    const [activeTab, setActiveTab] = useState<"receive" | "pay">("receive");

    // Auto-cycle through tabs
    useEffect(() => {
        const tabInterval = setInterval(() => {
            setActiveTab(current => current === "receive" ? "pay" : "receive");
        }, 5000);

        return () => clearInterval(tabInterval);
    }, []);

    // Handle manual tab change
    const handleTabChange = (tab: "receive" | "pay") => {
        setActiveTab(tab);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    // Features data
    const features = {
        receive: [
            {
                icon: <Tag className="w-4 h-4" />,
                title: "PayTag Registry",
                description: "Human-readable addresses"
            },
            {
                icon: <Smartphone className="w-4 h-4" />,
                title: "Airtime Converter",
                description: "Tokens to airtime instantly"
            },
        ],
        pay: [
            {
                icon: <Users className="w-4 h-4" />,
                title: "Payroll System",
                description: "Automated payments"
            },
            {
                icon: <Building className="w-4 h-4" />,
                title: "RWA Registry",
                description: "Tokenize real assets"
            },
        ]
    };

    return (
        <section className="relative pt-20 pb-10 px-4 overflow-hidden lg:hidden">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950" />

            <div className="container mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-md mx-auto"
                >
                    {/* Header */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-block mb-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium text-xs"
                    >
                        RealPayTag
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent leading-tight"
                    >
                        Get Paid Fast via @PayTag
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-slate-700 dark:text-slate-300 mb-4"
                    >
                        Send and receive payments with real-world asset backing.
                        No more fees, delays, or crypto volatility.
                    </motion.p>

                    {/* Feature tabs with simplified indicator */}
                    <motion.div variants={itemVariants} className="mb-5">
                        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-3">
                            <button
                                onClick={() => handleTabChange("receive")}
                                className={`flex-1 text-center rounded-md py-1.5 text-xs font-medium ${activeTab === "receive"
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                For Recipients
                            </button>
                            <button
                                onClick={() => handleTabChange("pay")}
                                className={`flex-1 text-center rounded-md py-1.5 text-xs font-medium ${activeTab === "pay"
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                For Businesses
                            </button>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                            {features[activeTab].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center p-2 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="mr-3 shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}

                            <Link href="/features" className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline mt-1">
                                See all features <ChevronRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Call to action buttons - prominently displayed */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-2 mt-6"
                    >
                        <WalletConnect className="w-full h-10 text-sm" />
                        <Link href="/dashboard" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-800 text-sm"
                            >
                                Explore Features
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default MobileHeroSection;