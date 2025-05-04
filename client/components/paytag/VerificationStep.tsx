"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, Loader2, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VerificationStepProps {
    isVerifying: boolean;
    handleVerify: () => Promise<void>;
    handlePrevStep: () => void;
}

const VerificationStep: FC<VerificationStepProps> = ({
    isVerifying,
    handleVerify,
    handlePrevStep
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    const benefits = [
        { icon: <Shield className="h-5 w-5" />, title: "Security", description: "Protect your PayTag from unauthorized use" },
        { icon: <Lock className="h-5 w-5" />, title: "Trust", description: "Build trust with other users on the platform" },
        { icon: <CheckCircle className="h-5 w-5" />, title: "Higher Limits", description: "Access higher transaction limits" }
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4">
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
                    Verify Your <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Identity</span>
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Verification helps secure your PayTag</p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-md">
                    <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Secure Your PayTag</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md">Verification adds security to your account and prevents others from using your PayTag.</p>
                {isVerifying ? (
                    <div className="w-full max-w-md space-y-2">
                        <Progress value={60} className="h-2 bg-slate-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-teal-500" />
                        <div className="flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying your identity...
                        </div>
                    </div>
                ) : (
                    <Button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full shadow-md" onClick={handleVerify}>
                        <Shield className="mr-2 h-4 w-4" />Verify Now
                    </Button>
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-slate-900 dark:text-white">Benefits of Verification</h3>
                <div className="grid grid-cols-3 gap-2">
                    {benefits.map((benefit, index) => (
                        <motion.div key={index} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700" whileHover={{ y: -3 }} variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0, transition: { delay: 0.1 + (index * 0.05) } }
                        }}>
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                                {benefit.icon}
                            </div>
                            <h4 className="font-medium text-sm mb-0.5 text-slate-900 dark:text-white">{benefit.title}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep} disabled={isVerifying} className="border-slate-200 dark:border-slate-700 text-sm py-1 h-8">
                    <ChevronLeft className="mr-1 h-3 w-3" /> Back
                </Button>
                <div className="w-[60px]"></div> {/* Spacer for visual balance */}
            </motion.div>
        </motion.div>
    );
};

export default VerificationStep;