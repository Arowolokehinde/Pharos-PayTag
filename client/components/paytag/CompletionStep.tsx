"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    ArrowRight,
    Copy,
    Tag,
    Wallet,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionStepProps {
    payTag: string;
    walletAddress?: string;
    handleFinish: () => void;
}

const CompletionStep: FC<CompletionStepProps> = ({
    payTag,
    walletAddress,
    handleFinish
}) => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const confettiVariants = {
        hidden: { opacity: 0, scale: 0.3, y: -50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    };

    const nextSteps = [
        {
            icon: <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            title: "Send Your First Payment",
            description: "Try sending a test payment to another user using their PayTag"
        },
        {
            icon: <Tag className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
            title: "Share Your PayTag",
            description: "Let friends and businesses know they can pay you with @" + payTag
        },
        {
            icon: <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            title: "Explore Your Wallet",
            description: "View your balance, transaction history, and account settings"
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
        >
            {/* Animated success icon with confetti effect */}
            <motion.div
                variants={confettiVariants}
                className="relative flex justify-center mb-8"
            >
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>

                {/* Confetti elements */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: Math.random() * 160 - 80,
                            y: Math.random() * 160 - 80,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0.5],
                            backgroundColor: [
                                i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#14b8a6" : "#22c55e",
                                i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#14b8a6" : "#22c55e",
                                i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#14b8a6" : "#22c55e"
                            ]
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 0.2 + (i * 0.05),
                            ease: "easeOut"
                        }}
                    />
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                    Congratulations!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Your PayTag has been successfully created and is ready to use.
                </p>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mb-8 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/80"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Your PayTag</div>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mr-2">
                                @{payTag}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 h-8 w-8 p-0"
                                onClick={() => navigator.clipboard.writeText(`@${payTag}`)}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Your unique identifier for sending and receiving payments
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Connected Wallet</div>
                        <div className="flex items-center">
                            <div className="text-sm font-mono bg-white dark:bg-slate-700 rounded px-2 py-1 mr-2">
                                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-6)}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 h-8 w-8 p-0"
                                onClick={() => navigator.clipboard.writeText(walletAddress ?? "")}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Your secure blockchain wallet address
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">
                    Next Steps
                </h3>

                <div className="space-y-3">
                    {nextSteps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center"
                            whileHover={{ x: 5, transition: { type: "spring", stiffness: 300 } }}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        delay: 0.6 + (index * 0.1),
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 15
                                    }
                                }
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-4">
                                {step.icon}
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-white">{step.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex justify-center"
            >
                <Button
                    className="px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white text-lg rounded-full shadow-lg hover:shadow-blue-600/20 dark:hover:shadow-blue-400/20 transition-all"
                    onClick={handleFinish}
                >
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default CompletionStep;