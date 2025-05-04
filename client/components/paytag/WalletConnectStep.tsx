"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletConnect from "@/components/auth/wallet-connect";

interface WalletConnectStepProps {
    isWalletConnected: boolean;
    walletAddress?: string;
    handleNextStep: () => void;
}

const WalletConnectStep: FC<WalletConnectStepProps> = ({
    isWalletConnected,
    walletAddress,
    handleNextStep
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

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
        >
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                    Welcome to <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">RealPayTag</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    To get started, connect your wallet to continue
                </p>
            </motion.div>

            {!isWalletConnected ? (
                <div className="space-y-6">
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center"
                    >
                        <div className="w-full max-w-md">
                            <WalletConnect className="w-full" />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30"
                    >
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-white mb-1">Why connect a wallet?</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Your wallet acts as your secure identity on the RealPayTag platform.
                                    It lets you send and receive payments while maintaining full control of your funds.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    variants={itemVariants}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-xl border-2 border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                                <CheckCircle className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    Wallet Connected Successfully
                                </h3>
                                <div className="flex items-center mt-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                        {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-6)}
                                    </span>
                                    <span className="flex items-center ml-3 text-xs text-slate-500 dark:text-slate-400">
                                        <Clock className="h-3 w-3 mr-1" /> Just now
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="flex items-center space-x-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="text-amber-600 dark:text-amber-400">
                            <Shield className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Next step: Create your unique @PayTag identifier
                        </p>
                    </motion.div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleNextStep}
                            className="px-6 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                        >
                            Continue <ChevronRight className="ml-1.5 h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default WalletConnectStep;