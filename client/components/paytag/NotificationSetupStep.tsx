"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    Mail,
    Smartphone,
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCircle,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface NotificationSetupStepProps {
    notificationMethod: "email" | "sms" | "none";
    emailAddress: string;
    phoneNumber: string;
    setNotificationMethod: (value: "email" | "sms" | "none") => void;
    setEmailAddress: (value: string) => void;
    setPhoneNumber: (value: string) => void;
    handlePrevStep: () => void;
    handleComplete: () => Promise<void>;
    isRegistering: boolean;
}

const NotificationSetupStep: FC<NotificationSetupStepProps> = ({
    notificationMethod,
    emailAddress,
    phoneNumber,
    setNotificationMethod,
    setEmailAddress,
    setPhoneNumber,
    handlePrevStep,
    handleComplete,
    isRegistering
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

    // Get button state
    const isButtonDisabled =
        (notificationMethod === "email" && !emailAddress) ||
        (notificationMethod === "sms" && !phoneNumber) ||
        isRegistering;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
        >
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                    Setup <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Notifications</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Choose how you want to be notified about payments and important updates
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-slate-700 dark:text-slate-300 flex gap-3 mb-6"
                >
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p>
                        Stay updated about incoming payments, security alerts, and important
                        account notifications. Your information is private and will only be used
                        for account-related communications.
                    </p>
                </motion.div>

                <RadioGroup
                    value={notificationMethod}
                    onValueChange={(value) => setNotificationMethod(value as "email" | "sms" | "none")}
                    className="space-y-4"
                >
                    <motion.div
                        variants={itemVariants}
                        className="flex items-start space-x-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer bg-white dark:bg-slate-800/60 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <RadioGroupItem value="email" id="email" className="mt-1" />
                        <div className="flex-1">
                            <Label
                                htmlFor="email"
                                className="flex items-center text-base font-medium cursor-pointer text-slate-900 dark:text-white"
                            >
                                <Mail className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                Email Notifications
                            </Label>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                Receive notifications via email
                            </div>
                            {notificationMethod === "email" && (
                                <motion.div
                                    className="mt-3 ml-7"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        className="border-slate-200 dark:border-slate-700"
                                    />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex items-start space-x-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer bg-white dark:bg-slate-800/60 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <RadioGroupItem value="sms" id="sms" className="mt-1" />
                        <div className="flex-1">
                            <Label
                                htmlFor="sms"
                                className="flex items-center text-base font-medium cursor-pointer text-slate-900 dark:text-white"
                            >
                                <Smartphone className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                                SMS Notifications
                            </Label>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                Receive notifications via SMS
                            </div>
                            {notificationMethod === "sms" && (
                                <motion.div
                                    className="mt-3 ml-7"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="border-slate-200 dark:border-slate-700"
                                    />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex items-start space-x-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer bg-white dark:bg-slate-800/60 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <RadioGroupItem value="none" id="none" className="mt-1" />
                        <div className="flex-1">
                            <Label
                                htmlFor="none"
                                className="flex items-center text-base font-medium cursor-pointer text-slate-900 dark:text-white"
                            >
                                <Bell className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" />
                                No Notifications
                            </Label>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                Skip notifications (not recommended)
                            </div>
                        </div>
                    </motion.div>
                </RadioGroup>

                <div className="flex items-center py-2">
                    <motion.div
                        className="w-full h-px bg-slate-200 dark:bg-slate-700 flex-grow"
                        variants={itemVariants}
                    />
                    <motion.span
                        className="px-3 text-sm text-slate-500 dark:text-slate-400"
                        variants={itemVariants}
                    >
                        Almost done
                    </motion.span>
                    <motion.div
                        className="w-full h-px bg-slate-200 dark:bg-slate-700 flex-grow"
                        variants={itemVariants}
                    />
                </div>

                {(notificationMethod === "email" && emailAddress) ||
                    (notificationMethod === "sms" && phoneNumber) ||
                    (notificationMethod === "none") ? (
                    <motion.div
                        variants={itemVariants}
                        className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-sm border border-green-100 dark:border-green-800 flex items-start space-x-3"
                    >
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-green-800 dark:text-green-300 font-medium">
                                You're all set to complete your registration!
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                In the next step, you'll see a summary of your PayTag setup. Click "Complete Setup" to finalize your registration.
                            </p>
                        </div>
                    </motion.div>
                ) : null}

                <motion.div variants={itemVariants} className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="border-slate-200 dark:border-slate-700"
                    >
                        <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={isButtonDisabled}
                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                    >
                        {isRegistering ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Complete Setup <ChevronRight className="ml-1.5 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default NotificationSetupStep;