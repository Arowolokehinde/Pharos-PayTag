"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ProgressSteps from "./ProgressSteps";
import WalletConnectStep from "./WalletConnectStep";
import PayTagSelectStep from "./PayTagSelectStep";
import VerificationStep from "./VerificationStep";
import NotificationSetupStep from "./NotificationSetupStep";
import CompletionStep from "./CompletionStep";
import EnhancedNavbar from "../layout/navbar";
import { useWallet } from "@/hooks/use-web3";


// Define type for our steps
interface RegistrationStep {
    id: string;
    title: string;
    description: string;
}

const PayTagRegistration: FC = () => {
    const router = useRouter();

    // Stepper steps
    const steps: RegistrationStep[] = [
        {
            id: "connect",
            title: "Connect Wallet",
            description: "Connect your wallet or create a new one"
        },
        {
            id: "select",
            title: "Choose PayTag",
            description: "Select your unique @PayTag identifier"
        },
        {
            id: "verify",
            title: "Verify Identity",
            description: "Verify your identity to secure your PayTag"
        },
        {
            id: "notifications",
            title: "Setup Notifications",
            description: "Configure payment notifications"
        },
        {
            id: "complete",
            title: "Complete",
            description: "Your PayTag is ready to use"
        }
    ];

    // States
    const [currentStep, setCurrentStep] = useState(0);
    const [payTag, setPayTag] = useState("");
    const [isPayTagChecking, setIsPayTagChecking] = useState(false);
    const [isPayTagAvailable, setIsPayTagAvailable] = useState<boolean | null>(null);
    const [payTagError, setPayTagError] = useState("");
    const [notificationMethod, setNotificationMethod] = useState<"email" | "sms" | "none">("email");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Track progress
    const progress = (currentStep / (steps.length - 1)) * 100;

    const { address, isConnected } = useWallet()

    // Format PayTag input
    const formatPayTag = (input: string): string => {
        // Remove spaces and special characters, convert to lowercase
        const formatted = input.toLowerCase().replace(/[^a-z0-9_]/g, "");
        return formatted;
    };

    // Check PayTag availability
    const checkPayTagAvailability = async (tag: string) => {
        if (tag.length < 3) {
            setIsPayTagAvailable(null);
            return;
        }

        setIsPayTagChecking(true);
        setPayTagError("");

        // Simulate API check
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock availability check (tags "admin", "support", etc. are reserved)
        const reservedTags = ["admin", "support", "help", "official", "system", "realpay"];
        const isAvailable = !reservedTags.includes(tag);

        setIsPayTagAvailable(isAvailable);
        setIsPayTagChecking(false);

        if (!isAvailable) {
            setPayTagError("This PayTag is already taken or reserved");
        }
    };

    // Handle PayTag input change
    const handlePayTagChange = (value: string) => {
        const formatted = formatPayTag(value);
        setPayTag(formatted);

        // Check availability when length >= 3
        if (formatted.length >= 3) {
            checkPayTagAvailability(formatted);
        } else {
            setIsPayTagAvailable(null);
            setPayTagError(formatted.length > 0 ? "PayTag must be at least 3 characters" : "");
        }
    };

    // Validate current step
    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 0: // Connect wallet
                return isConnected;

            case 1: // Choose PayTag
                return payTag.length >= 3 && isPayTagAvailable === true;

            case 2: // Verify identity
                return true; // For demo purposes, always valid

            case 3: // Notifications
                if (notificationMethod === "email") {
                    // Simple email validation
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
                } else if (notificationMethod === "sms") {
                    // Simple phone validation (any non-empty string)
                    return phoneNumber.length > 0;
                }
                return true; // If "none" is selected

            default:
                return true;
        }
    };

    // Handle next step
    const handleNextStep = () => {
        if (currentStep < steps.length - 1 && validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Handle prev step
    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle final completion
    const handleComplete = async () => {
        setIsRegistering(true);

        // Simulate registration process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsRegistering(false);
        handleNextStep(); // Move to completion screen
    };

    // Handle verification
    const handleVerify = async () => {
        setIsVerifying(true);

        // Simulate verification process
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setIsVerifying(false);
        handleNextStep(); // Move to notification setup
    };

    // Handle finish - redirect to dashboard
    const handleFinish = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Page header with branding */}
            <EnhancedNavbar />

            {/* Main Content with animated background */}
            <main className="flex-1 flex items-center justify-center px-4 py-24 relative">
                {/* Background with animated elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950" />

                    {/* Animated gradient overlays */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-100/50 to-transparent dark:from-blue-500/10 dark:to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-teal-100/30 to-transparent dark:from-teal-500/10 dark:to-transparent" />

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                            backgroundSize: '4rem 4rem',
                        }}
                    />

                    {/* Subtle floating elements */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full blur-3xl opacity-10 dark:opacity-5"
                            initial={{
                                x: Math.random() * 100 - 50 + "%",
                                y: Math.random() * 100 - 50 + "%",
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            animate={{
                                x: Math.random() * 100 - 50 + "%",
                                y: Math.random() * 100 - 50 + "%",
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            transition={{
                                duration: Math.random() * 20 + 10,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            style={{
                                width: Math.random() * 400 + 200,
                                height: Math.random() * 400 + 200,
                                background: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
                                    Math.random() * 100 + 100
                                )}, ${Math.floor(Math.random() * 200 + 55)}, 0.4)`,
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    className="w-full max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Title and progress */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                            Create Your PayTag
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Set up your personal PayTag to send and receive payments easily
                        </p>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-600 to-teal-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    {/* Steps indicator */}
                    <ProgressSteps
                        steps={steps}
                        currentStep={currentStep}
                    />

                    {/* Step content */}
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 p-1 rounded-3xl rounded-bl-[40px] rounded-tr-[70px] shadow-xl overflow-hidden">
                        {currentStep === 0 && (
                            <WalletConnectStep
                                isWalletConnected={isConnected}
                                walletAddress={address}
                                handleNextStep={handleNextStep}
                            />
                        )}

                        {currentStep === 1 && (
                            <PayTagSelectStep
                                payTag={payTag}
                                isPayTagChecking={isPayTagChecking}
                                isPayTagAvailable={isPayTagAvailable}
                                payTagError={payTagError}
                                handlePayTagChange={handlePayTagChange}
                                handleNextStep={handleNextStep}
                                handlePrevStep={handlePrevStep}
                            />
                        )}

                        {currentStep === 2 && (
                            <VerificationStep
                                isVerifying={isVerifying}
                                handleVerify={handleVerify}
                                handlePrevStep={handlePrevStep}
                            />
                        )}

                        {currentStep === 3 && (
                            <NotificationSetupStep
                                notificationMethod={notificationMethod}
                                emailAddress={emailAddress}
                                phoneNumber={phoneNumber}
                                setNotificationMethod={setNotificationMethod}
                                setEmailAddress={setEmailAddress}
                                setPhoneNumber={setPhoneNumber}
                                handlePrevStep={handlePrevStep}
                                handleComplete={handleComplete}
                                isRegistering={isRegistering}
                            />
                        )}

                        {currentStep === 4 && (
                            <CompletionStep
                                payTag={payTag}
                                walletAddress={address}
                                handleFinish={handleFinish}
                            />
                        )}
                    </div>

                    {/* Bottom info text */}
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                        By continuing, you agree to our <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default PayTagRegistration;