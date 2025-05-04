"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tag,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Smartphone,
    Mail,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Wallet,
    Bell,
    Shield,
    Plus,
    Copy,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
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

    // Handle wallet connection
    const connectWallet = async () => {
        setIsWalletConnected(false);

        // Simulate wallet connection
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulated wallet address
        const mockAddress = "0x1a2b3c4d5e6f7g8h9i0j";
        setWalletAddress(mockAddress);
        setIsWalletConnected(true);

        // Move to next step after wallet connection
        setTimeout(() => {
            handleNextStep();
        }, 1000);
    };

    // Handle create wallet
    const createWallet = async () => {
        setIsWalletConnected(false);

        // Simulate wallet creation (longer process)
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Simulated wallet address
        const mockAddress = "0x9i8h7g6f5e4d3c2b1a";
        setWalletAddress(mockAddress);
        setIsWalletConnected(true);

        // Move to next step after wallet creation
        setTimeout(() => {
            handleNextStep();
        }, 1000);
    };

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
                return isWalletConnected;

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-slate-50 dark:from-slate-950 dark:via-blue-950/5 dark:to-slate-950 flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
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
                                    <Link href="/help" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                                        Help
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Title and progress */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                            Create Your PayTag
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Set up your personal PayTag to send and receive payments easily
                        </p>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Steps indicator */}
                    <div className="flex justify-between mb-8 relative">
                        {/* Connecting line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>

                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center relative z-0">
                                <motion.div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                                        currentStep > index
                                            ? "bg-gradient-to-br from-blue-600 to-teal-500 text-white border-transparent"
                                            : currentStep === index
                                                ? "bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                                    )}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {currentStep > index ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </motion.div>
                                <div className="text-xs text-center mt-2 font-medium text-slate-600 dark:text-slate-400 max-w-[80px]">
                                    {step.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Step content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`step-${currentStep}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
                                {/* Step 1: Connect Wallet */}
                                {currentStep === 0 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle>Connect Your Wallet</CardTitle>
                                            <CardDescription>
                                                Connect an existing wallet or create a new one to continue
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {!isWalletConnected ? (
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        className="h-32 flex flex-col items-center justify-center space-y-2 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                                        onClick={connectWallet}
                                                    >
                                                        <Wallet className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                                        <span className="font-medium">Connect Existing Wallet</span>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        className="h-32 flex flex-col items-center justify-center space-y-2 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                                        onClick={createWallet}
                                                    >
                                                        <Plus className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                                        <span className="font-medium">Create New Wallet</span>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="p-4 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                                                    <div className="flex items-center">
                                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                                                        <div>
                                                            <div className="font-medium text-green-600 dark:text-green-400">
                                                                Wallet Connected Successfully
                                                            </div>
                                                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end">
                                                <Button
                                                    disabled={!isWalletConnected}
                                                    className="mt-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                                    onClick={handleNextStep}
                                                >
                                                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 2: Choose PayTag */}
                                {currentStep === 1 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle>Choose Your PayTag</CardTitle>
                                            <CardDescription>
                                                Select a unique identifier that others will use to send you payments
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center mb-2">
                                                    <Tag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                    <div className="font-medium">Your PayTag</div>
                                                </div>

                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <span className="text-slate-500 dark:text-slate-400">@</span>
                                                    </div>
                                                    <Input
                                                        className="pl-8 border-2 focus:border-blue-500 dark:focus:border-blue-400 h-12"
                                                        placeholder="yourname"
                                                        value={payTag}
                                                        onChange={(e) => handlePayTagChange(e.target.value)}
                                                    />
                                                </div>

                                                {/* Availability indicator */}
                                                <div className="min-h-[24px]">
                                                    {isPayTagChecking && (
                                                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                                                            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                                            Checking availability...
                                                        </div>
                                                    )}

                                                    {!isPayTagChecking && isPayTagAvailable === true && payTag.length >= 3 && (
                                                        <div className="flex items-center text-green-600 dark:text-green-400">
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            @{payTag} is available!
                                                        </div>
                                                    )}

                                                    {!isPayTagChecking && isPayTagAvailable === false && (
                                                        <div className="flex items-center text-red-600 dark:text-red-400">
                                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                                            {payTagError}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-slate-700 dark:text-slate-300">
                                                    <p className="font-medium mb-2">Tips for choosing your PayTag:</p>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Minimum 3 characters</li>
                                                        <li>Can include letters, numbers, and underscores</li>
                                                        <li>No spaces or special characters</li>
                                                        <li>Case insensitive (e.g., @user is the same as @USER)</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevStep}
                                                    className="border-slate-200 dark:border-slate-700"
                                                >
                                                    <ChevronLeft className="mr-1 h-4 w-4" /> Back
                                                </Button>
                                                <Button
                                                    disabled={!isPayTagAvailable || payTag.length < 3}
                                                    onClick={handleNextStep}
                                                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                                >
                                                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 3: Verify Identity */}
                                {currentStep === 2 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle>Verify Your Identity</CardTitle>
                                            <CardDescription>
                                                We need to verify your identity to secure your PayTag
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center mb-2">
                                                    <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                    <div className="font-medium">Verify Your Identity</div>
                                                </div>

                                                <div className="p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                                                        <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                    </div>

                                                    <h3 className="text-lg font-bold mb-2">Secure Your PayTag</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
                                                        We need to verify your identity to ensure your PayTag cannot be taken by someone else.
                                                    </p>

                                                    {isVerifying ? (
                                                        <div className="w-full max-w-md space-y-2">
                                                            <Progress value={60} className="h-2 bg-slate-200 dark:bg-slate-700" />
                                                            <div className="flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                                                Verifying your identity...
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                                            onClick={handleVerify}
                                                        >
                                                            Verify Now
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevStep}
                                                    disabled={isVerifying}
                                                    className="border-slate-200 dark:border-slate-700"
                                                >
                                                    <ChevronLeft className="mr-1 h-4 w-4" /> Back
                                                </Button>
                                                <Button
                                                    disabled={true}
                                                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white opacity-50"
                                                >
                                                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 4: Setup Notifications */}
                                {currentStep === 3 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle>Setup Notifications</CardTitle>
                                            <CardDescription>
                                                Choose how you want to receive payment notifications
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center mb-2">
                                                    <Bell className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                    <div className="font-medium">Setup Notifications</div>
                                                </div>

                                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-slate-700 dark:text-slate-300 mb-4">
                                                    Choose how you want to receive payment notifications and important account updates
                                                </div>

                                                <RadioGroup
                                                    value={notificationMethod}
                                                    onValueChange={(value) => setNotificationMethod(value as "email" | "sms" | "none")}
                                                    className="space-y-4"
                                                >
                                                    <div className="flex items-start space-x-2 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer">
                                                        <RadioGroupItem value="email" id="email" className="mt-1" />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor="email"
                                                                className="flex items-center text-base font-medium cursor-pointer"
                                                            >
                                                                <Mail className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                                Email Notifications
                                                            </Label>
                                                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                                                Receive notifications via email
                                                            </div>
                                                            {notificationMethod === "email" && (
                                                                <div className="mt-3 ml-7">
                                                                    <Input
                                                                        type="email"
                                                                        placeholder="Enter your email address"
                                                                        value={emailAddress}
                                                                        onChange={(e) => setEmailAddress(e.target.value)}
                                                                        className="border-slate-200 dark:border-slate-700"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-2 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer">
                                                        <RadioGroupItem value="sms" id="sms" className="mt-1" />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor="sms"
                                                                className="flex items-center text-base font-medium cursor-pointer"
                                                            >
                                                                <Smartphone className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                                SMS Notifications
                                                            </Label>
                                                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                                                Receive notifications via SMS
                                                            </div>
                                                            {notificationMethod === "sms" && (
                                                                <div className="mt-3 ml-7">
                                                                    <Input
                                                                        type="tel"
                                                                        placeholder="Enter your phone number"
                                                                        value={phoneNumber}
                                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                                        className="border-slate-200 dark:border-slate-700"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start space-x-2 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer">
                                                        <RadioGroupItem value="none" id="none" className="mt-1" />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor="none"
                                                                className="flex items-center text-base font-medium cursor-pointer"
                                                            >
                                                                No Notifications
                                                            </Label>
                                                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                                                I don't want to receive notifications
                                                            </div>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevStep}
                                                    className="border-slate-200 dark:border-slate-700"
                                                >
                                                    <ChevronLeft className="mr-1 h-4 w-4" /> Back
                                                </Button>
                                                <Button
                                                    onClick={handleComplete}
                                                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                                    disabled={
                                                        (notificationMethod === "email" && !emailAddress) ||
                                                        (notificationMethod === "sms" && !phoneNumber) ||
                                                        isRegistering
                                                    }
                                                >
                                                    {isRegistering ? (
                                                        <>
                                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Complete Setup <ChevronRight className="ml-1 h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </>
                                )}

                                {/* Step 5: Completion */}
                                {currentStep === 4 && (
                                    <>
                                        <CardHeader>
                                            <CardTitle>Registration Complete</CardTitle>
                                            <CardDescription>
                                                Your PayTag has been successfully created
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-6 text-center">
                                                <motion.div
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 200,
                                                        damping: 15
                                                    }}
                                                    className="flex justify-center"
                                                >
                                                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                                                        Congratulations!
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                                                        Your PayTag has been successfully created and is ready to use.
                                                    </p>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                                >
                                                    <div className="mb-4">
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">Your PayTag</div>
                                                        <div className="flex items-center justify-center mt-1">
                                                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                                                @{payTag}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="ml-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                                                onClick={() => navigator.clipboard.writeText(`@${payTag}`)}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">Connected Wallet</div>
                                                        <div className="flex items-center justify-center mt-1">
                                                            <div className="text-sm font-mono bg-slate-100 dark:bg-slate-700 rounded px-2 py-1">
                                                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="ml-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                                                onClick={() => navigator.clipboard.writeText(walletAddress)}
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="flex justify-center"
                                                >
                                                    <Button
                                                        className="mt-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-6"
                                                        onClick={handleFinish}
                                                    >
                                                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </CardContent>
                                    </>
                                )}
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                        <div>
                            &copy; {new Date().getFullYear()} RealPayTag. All rights reserved.
                        </div>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</Link>
                            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link>
                            <Link href="/help" className="hover:text-blue-600 dark:hover:text-blue-400">Help</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PayTagRegistration;