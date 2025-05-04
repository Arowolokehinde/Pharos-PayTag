"use client";

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tag,
    CheckCircle,
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Copy,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PayTagSelectStepProps {
    payTag: string;
    isPayTagChecking: boolean;
    isPayTagAvailable: boolean | null;
    payTagError: string;
    handlePayTagChange: (value: string) => void;
    handleNextStep: () => void;
    handlePrevStep: () => void;
}

const PayTagSelectStep: FC<PayTagSelectStepProps> = ({
    payTag,
    isPayTagChecking,
    isPayTagAvailable,
    payTagError,
    handlePayTagChange,
    handleNextStep,
    handlePrevStep
}) => {
    // Generate suggestions based on payTag pattern
    const [suggestions, setSuggestions] = useState<string[]>([]);

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

    // Generate random suggestions
    useEffect(() => {
        if (payTag.length >= 2) {
            const suggestedTags = [
                `${payTag}123`,
                `${payTag}_official`,
                `${payTag}_real`,
                `real_${payTag}`,
                `${payTag}_pay`
            ].filter(tag => tag !== payTag);

            setSuggestions(suggestedTags.slice(0, 3));
        } else {
            setSuggestions([]);
        }
    }, [payTag]);

    const handleSelectSuggestion = (suggestion: string) => {
        handlePayTagChange(suggestion);
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
                    Choose Your <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">PayTag</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Your PayTag is a unique identifier that others will use to send you payments
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center mb-2">
                        <Tag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        <div className="font-medium">Create Your PayTag</div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">@</span>
                        </div>
                        <Input
                            className="pl-8 h-12 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                            placeholder="yourname"
                            value={payTag}
                            onChange={(e) => handlePayTagChange(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Availability indicator */}
                    <AnimatePresence mode="wait">
                        {isPayTagChecking && (
                            <motion.div
                                key="checking"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center text-slate-600 dark:text-slate-400"
                            >
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Checking availability...
                            </motion.div>
                        )}

                        {!isPayTagChecking && isPayTagAvailable === true && payTag.length >= 3 && (
                            <motion.div
                                key="available"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center text-green-600 dark:text-green-400"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                @{payTag} is available!
                            </motion.div>
                        )}

                        {!isPayTagChecking && isPayTagAvailable === false && (
                            <motion.div
                                key="unavailable"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center text-red-600 dark:text-red-400"
                            >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {payTagError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Suggestions */}
                    {suggestions.length > 0 && isPayTagAvailable === false && (
                        <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Try one of these available alternatives:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion, index) => (
                                    <Button
                                        key={suggestion}
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                    >
                                        @{suggestion}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        variants={itemVariants}
                        className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-slate-700 dark:text-slate-300"
                    >
                        <div className="flex">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium mb-2">Tips for choosing your PayTag:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Minimum 3 characters</li>
                                    <li>Can include letters, numbers, and underscores</li>
                                    <li>No spaces or special characters</li>
                                    <li>Case insensitive (e.g., @user is the same as @USER)</li>
                                </ul>
                            </div>
                        </div>

                        <motion.div
                            className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-800"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                Your personal payment address will be:
                            </p>
                            <div className="flex items-center mt-1">
                                <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">
                                    paytag.io/@{payTag || "yourname"}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-6 w-6 p-0 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                    disabled={!payTag}
                                    onClick={() => navigator.clipboard.writeText(`paytag.io/@${payTag}`)}
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="border-slate-200 dark:border-slate-700"
                    >
                        <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                    <Button
                        disabled={!isPayTagAvailable || payTag.length < 3}
                        onClick={handleNextStep}
                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                    >
                        Continue <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default PayTagSelectStep;