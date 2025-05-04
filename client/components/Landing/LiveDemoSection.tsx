"use client";

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Settings,
    PiggyBank,
    Users,
    Tag,
    Building,
    ArrowRight,
    CheckCircle2,
    Smartphone,
    Globe,
    ChevronRight,
    Shield,
    Coins,
    KeySquare,
    LockKeyhole
} from "lucide-react";

const EnhancedSplitLiveDemo: FC = () => {
    const [demoStep, setDemoStep] = useState(0);
    const [walletBalance, setWalletBalance] = useState(1250);
    const [showNotification, setShowNotification] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Auto-cycle through the demo
    useEffect(() => {
        const interval = setInterval(() => {
            setDemoStep((prev) => (prev + 1) % 4);

            // Show notification when payment is received
            if (demoStep === 1) {
                setWalletBalance(prev => prev + 1000);
                setShowNotification(true);

                // Hide notification after 3 seconds
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [demoStep]);

    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
            },
        },
    };

    const notificationVariants = {
        hidden: { opacity: 0, y: -20, x: "-50%" },
        visible: {
            opacity: 1,
            y: 0,
            x: "-50%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            y: -30,
            x: "-50%",
            transition: {
                duration: 0.3
            }
        }
    };

    // Additional animation variants
    const floatAnimation = {
        initial: { y: 0 },
        animate: {
            y: [-5, 5, -5],
            transition: {
                duration: 6,
                repeat: Infinity,
                repeatType: "loop" as const,
                ease: "easeInOut"
            }
        }
    };

    // Fix for the pulse animation variant
    const pulseAnimation = {
        initial: { scale: 1, opacity: 0.9 },
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "loop" as const,
                ease: "easeInOut"
            }
        }
    };

    const securityFeatures = [
        {
            title: "Multi-Signature Wallets",
            description: "Require multiple approvals for high-value transactions",
            icon: <Shield className="w-5 h-5" />,
        },
        {
            title: "Time-Locked Vaults",
            description: "Schedule releases of funds with customizable time periods",
            icon: <LockKeyhole className="w-5 h-5" />,
        },
        {
            title: "Asset Backed Security",
            description: "Every token is 100% backed by verified real-world assets",
            icon: <Coins className="w-5 h-5" />,
        }
    ];

    const steps = [
        {
            title: "Get Your PayTag",
            content: (
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Register Your PayTag</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">@</div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Your PayTag</p>
                                <p className="font-medium">@arowolo</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Connected Wallet</p>
                                <p className="font-medium text-sm">0x71C...93E2</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium">
                            Registration Complete
                        </button>
                    </div>
                </div>
            )
        },
        {
            title: "Employer Pays You",
            content: (
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="text-xl font-semibold mb-4">HR Dashboard</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Building className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Company</p>
                                <p className="font-medium">RealTech Ltd</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Employee</p>
                                <p className="font-medium">@arowolo</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <PiggyBank className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Amount</p>
                                <p className="font-medium">1,000 RPSC</p>
                            </div>
                        </div>
                        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium">
                            Payment Processed
                        </button>
                    </div>
                </div>
            )
        },
        {
            title: "Receive Payment",
            content: (
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Your PayTag Wallet</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm opacity-90">Available Balance</p>
                                <Tag className="w-5 h-5 opacity-90" />
                            </div>
                            <p className="text-3xl font-bold mb-1">{walletBalance.toLocaleString()} RPSC</p>
                            <p className="text-sm opacity-90">≈ ${walletBalance.toLocaleString()} USD</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Recent Transactions</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Payment Received</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">From: RealTech Ltd</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-600 dark:text-green-400">+1,000 RPSC</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">May 03, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Spend Your Money",
            content: (
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Convert to Airtime</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Phone Number</p>
                                <p className="font-medium">+234 801 234 5678</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <PiggyBank className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Amount</p>
                                <p className="font-medium">100 RPSC</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Network</p>
                                <p className="font-medium">MTN Nigeria</p>
                            </div>
                        </div>
                        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium">
                            Airtime Sent Successfully
                        </button>
                    </div>
                </div>
            )
        },
    ];

    return (
        <section className="py-12 md:py-16 px-4 relative bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/10 dark:to-slate-900">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                            See RealPayTag in Action
                        </span>
                    </h2>
                    <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                        Experience our seamless workflow in this interactive demo
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left column: Demo laptop */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="w-full lg:w-7/12"
                    >
                        <div className="relative">
                            {/* Notification */}
                            <AnimatePresence>
                                {showNotification && (
                                    <motion.div
                                        className="absolute top-0 left-1/2 z-50 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg border border-green-200 dark:border-green-800"
                                        variants={notificationVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="font-medium">Payment Received: 1,000 RPSC</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Floating animation wrapper */}
                            <motion.div
                                variants={floatAnimation}
                                initial="initial"
                                animate="animate"
                            >
                                {/* Laptop mockup */}
                                <div className="relative mx-auto bg-slate-800 rounded-t-xl w-full max-w-4xl h-[28rem] pb-[20%] overflow-hidden shadow-2xl">
                                    {/* Laptop top frame */}
                                    <div className="absolute top-0 left-0 right-0 h-6 bg-slate-700 rounded-t-xl flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-slate-500" />
                                    </div>

                                    {/* Screen content */}
                                    <div className="absolute top-6 left-0 right-0 bottom-0 bg-white dark:bg-slate-900 overflow-hidden">
                                        {/* App header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-4 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-lg">RealPayTag</h3>
                                                <p className="text-blue-100 text-sm">@arowolo</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <motion.button
                                                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Bell className="w-5 h-5" />
                                                </motion.button>
                                                <motion.button
                                                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Settings className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Demo tabs */}
                                        <div className="flex border-b border-slate-200 dark:border-slate-700 relative">
                                            {steps.map((step, index) => (
                                                <motion.button
                                                    key={index}
                                                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${demoStep === index
                                                        ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                                                        : "text-slate-600 dark:text-slate-400"
                                                        }`}
                                                    onClick={() => setDemoStep(index)}
                                                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                                                >
                                                    {step.title}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {/* Demo content */}
                                        <div className="p-6">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={demoStep}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {steps[demoStep].content}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Laptop bottom */}
                                <div className="relative mx-auto bg-slate-700 rounded-b-xl w-[95%] h-[3rem] max-w-[calc(4rem_*_95%)] mt-1 shadow-2xl before:absolute before:inset-0 before:rounded-b-xl before:bg-slate-800 before:h-[40%]"></div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right column: Security features */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-5/12 flex flex-col justify-center"
                    >
                        <motion.div
                            className="p-6 lg:p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 shadow-lg"
                            whileHover={{ boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)" }}
                            transition={{ duration: 0.3 }}
                            onHoverStart={() => setHovered(true)}
                            onHoverEnd={() => setHovered(false)}
                        >
                            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Enterprise-Grade Security</h3>

                            <p className="text-slate-700 dark:text-slate-300 mb-6">
                                RealPayTag provides cutting-edge security features to protect your assets. Our platform is built with multiple layers of protection.
                            </p>

                            <div className="space-y-5">
                                {securityFeatures.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start space-x-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <motion.div
                                            className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400"
                                            variants={pulseAnimation}
                                            animate={hovered ? "animate" : "initial"}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{feature.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                className="mt-8 flex"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                    Learn more about our security <ChevronRight className="ml-1 w-5 h-5" />
                                </a>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EnhancedSplitLiveDemo;


