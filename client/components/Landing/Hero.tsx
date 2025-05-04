"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import WalletConnect from "@/components/auth/wallet-connect";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    PiggyBank,
    Users,
    Tag,
    Building,
    Smartphone,
    Lock,
    CheckCircle,
    ArrowRight,
    BarChart3,
    ChevronRight,
    User,
    Briefcase
} from "lucide-react";
import { useWallet } from "@/hooks/use-web3";

const DesktopHeroSection: FC = () => {
    const [activeTab, setActiveTab] = useState<"receive" | "pay">("receive");
    const [demoStep, setDemoStep] = useState(0);
    const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState<"recipient" | "business">("recipient");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    const { isConnected } = useWallet();

    // Auto-cycle through demo steps and tabs
    useEffect(() => {
        const demoInterval = setInterval(() => {
            setDemoStep((prev) => (prev + 1) % 4);

            // Switch tab every 2 steps
            if (demoStep % 2 === 1) {
                setActiveTab(current => current === "receive" ? "pay" : "receive");
            }
        }, 4000);

        return () => clearInterval(demoInterval);
    }, [demoStep]);

    // Handle manual tab change
    const handleTabChange = (tab: "receive" | "pay") => {
        setActiveTab(tab);
        // Reset demo step to beginning of sequence for that tab
        setDemoStep(tab === "receive" ? 0 : 1);
    };

    const handleWalletConnection = async () => {
        // Check if the wallet component succeeded in connecting

        if (!isConnected) {
            // Check if user-type and pay-tag exist in local storage
            const userType = localStorage.getItem("user-type");
            const payTag = localStorage.getItem("pay-tag");

            if (!userType || !payTag) {
                // If user-type doesn't exist, show the modal
                if (!userType) {
                    setIsUserTypeModalOpen(true);
                } else {
                    // If only pay-tag is missing, redirect to the pay-tag setup
                    setIsRedirecting(true);
                    setTimeout(() => {
                        router.push("/registration");
                    }, 2000);
                }
            } else {
                // Both user-type and pay-tag exist, proceed normally
                // Continue with your app flow
            }
        }
    };

    const handleUserTypeSelection = () => {
        // Save the selected user type to local storage
        localStorage.setItem("user-type", selectedUserType);
        setIsUserTypeModalOpen(false);

        // Show redirecting message and navigate to registration page
        setIsRedirecting(true);
        setTimeout(() => {
            router.push("/registration");
        }, 2000);
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
        hidden: { y: 20, opacity: 0 },
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
                description: "Human-readable wallet addresses"
            },
            {
                icon: <PiggyBank className="w-4 h-4" />,
                title: "Instant Payments",
                description: "No delays or high fees"
            },
            {
                icon: <Smartphone className="w-4 h-4" />,
                title: "Airtime Convert",
                description: "Tokens to airtime instantly"
            },
        ],
        pay: [
            {
                icon: <Users className="w-4 h-4" />,
                title: "Payroll System",
                description: "Automated employee payments"
            },
            {
                icon: <Building className="w-4 h-4" />,
                title: "RWA Registry",
                description: "Tokenize real-world assets"
            },
            {
                icon: <Lock className="w-4 h-4" />,
                title: "Secure Locks",
                description: "Multi-signature security"
            },
        ]
    };

    // Active tab indicator animation
    const activeIndicator = {
        receive: { left: "0%", width: "50%" },
        pay: { left: "50%", width: "50%" }
    };

    return (
        <section className="relative pt-28 pb-10 md:pt-24 md:pb-16 px-4 overflow-hidden">
            {/* Advanced background with layered gradient */}
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

            <div className="container mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto"
                >
                    {/* Two-column layout */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
                        {/* Left column: Content */}
                        <div className="w-full lg:w-[45%]">
                            <motion.div
                                variants={itemVariants}
                                className="inline-block mb-4 px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium text-xs"
                            >
                                RealPayTag - Web3 Finance Platform
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent leading-tight"
                            >
                                Get Paid Fast, Fair, and Stable via @PayTag
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-base text-slate-700 dark:text-slate-300 mb-5"
                            >
                                A seamless way to send and receive payments backed by real-world assets.
                                No more high fees, slow bank transfers, or crypto volatility.
                            </motion.p>

                            {/* Feature tabs with animated active indicator */}
                            <motion.div variants={itemVariants} className="mb-5 hidden md:block">
                                <div className="relative mb-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex relative">
                                        <button
                                            onClick={() => handleTabChange("receive")}
                                            className={`px-4 py-2 flex-1 text-sm font-medium relative z-10 ${activeTab === "receive"
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-slate-600 dark:text-slate-400"
                                                }`}
                                        >
                                            For Recipients
                                        </button>
                                        <button
                                            onClick={() => handleTabChange("pay")}
                                            className={`px-4 py-2 flex-1 text-sm font-medium relative z-10 ${activeTab === "pay"
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-slate-600 dark:text-slate-400"
                                                }`}
                                        >
                                            For Businesses
                                        </button>
                                    </div>

                                    {/* Animated active tab indicator */}
                                    <motion.div
                                        className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                                        animate={activeTab}
                                        variants={activeIndicator}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />

                                </div>

                                <div className="space-y-2">
                                    {features[activeTab].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="flex items-center p-2 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="mr-3 shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">{feature.title}</h3>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    <Link href="/features" className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline mt-1">
                                        See all features <ChevronRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                                <WalletConnect className="h-10 text-sm" />

                                {isConnected && (
                                    <>
                                        <Link href="/dashboard/user">
                                            <Button
                                                variant="outline"
                                                className="h-10 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-800 text-sm"
                                            >
                                                Freelancer Dashoard
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/employer">
                                            <Button
                                                variant="outline"
                                                className="h-10 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-800 text-sm"
                                            >
                                                Employer Dashbaord
                                            </Button>
                                        </Link>
                                    </>
                                )}

                            </motion.div>
                        </div>

                        {/* Right column: Interactive demo */}
                        <div className="w-full lg:w-[55%]">
                            {/* Dashboard demo with fixed content and animated elements */}
                            <motion.div
                                variants={itemVariants}
                                className="relative rounded-xl overflow-hidden shadow-2xl"
                            >
                                {/* Decorative gradient border */}
                                <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                                </div>

                                {/* Dashboard header with fake browser bar */}
                                <div className="relative rounded-t-xl overflow-hidden">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-2 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <div className="mx-auto text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1">RealPayTag Dashboard</div>
                                    </div>

                                    {/* Dashboard content based on active tab */}
                                    <div className="relative">
                                        {/* Receiver Dashboard */}
                                        <div
                                            className={`p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 ${activeTab === "receive" ? "block" : "hidden"}`}
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">PayTag Wallet</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">@arowolo</p>
                                                </div>
                                                <Badge className="bg-gradient-to-r from-blue-600 to-teal-500">Connected</Badge>
                                            </div>

                                            {/* Wallet balance card */}
                                            <div className="p-4 mb-4 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                                                <div className="text-xs opacity-80">Available Balance</div>
                                                <div className="text-2xl font-bold my-1">
                                                    {demoStep === 0 ? "2,500" :
                                                        demoStep === 1 ? "3,500" :
                                                            demoStep === 2 ? "3,500" :
                                                                "3,400"} RPSC
                                                </div>
                                                <div className="text-xs opacity-80 flex justify-between">
                                                    <span>≈ ${demoStep === 0 ? "2,500" :
                                                        demoStep === 1 ? "3,500" :
                                                            demoStep === 2 ? "3,500" :
                                                                "3,400"} USD</span>
                                                    <span>Just now</span>
                                                </div>

                                                {demoStep === 1 && (
                                                    <div className="mt-2 bg-white/20 rounded-lg p-1.5 text-xs animate-pulse">
                                                        <CheckCircle className="w-3 h-3 inline mr-1" /> Payment received: +1,000 RPSC
                                                    </div>
                                                )}
                                            </div>

                                            {/* Recent transactions */}
                                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 font-medium text-sm">
                                                    Recent Transactions
                                                </div>
                                                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                                    {demoStep >= 1 && (
                                                        <div className={`flex justify-between items-center px-3 py-2 ${demoStep === 1 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                            <div className="flex items-center">
                                                                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
                                                                    <ArrowRight className="w-3 h-3" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">Payment Received</div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400">From: RealTech Ltd</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-medium text-sm text-green-600 dark:text-green-400">+1,000 RPSC</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">May 3, 2025</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {demoStep >= 3 && (
                                                        <div className={`flex justify-between items-center px-3 py-2 ${demoStep === 3 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                            <div className="flex items-center">
                                                                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
                                                                    <Smartphone className="w-3 h-3" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">Airtime Conversion</div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400">MTN Nigeria</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-medium text-sm text-slate-600 dark:text-slate-400">-100 RPSC</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">May 3, 2025</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center px-3 py-2">
                                                        <div className="flex items-center">
                                                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-2">
                                                                <BarChart3 className="w-3 h-3" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm">Staking Rewards</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">Weekly reward</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium text-sm text-green-600 dark:text-green-400">+25 RPSC</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">Apr 26, 2025</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payer Dashboard */}
                                        <div
                                            className={`p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 ${activeTab === "pay" ? "block" : "hidden"}`}
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">HR Dashboard</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">RealTech Ltd</p>
                                                </div>
                                                <Badge className="bg-gradient-to-r from-blue-600 to-teal-500">Admin</Badge>
                                            </div>

                                            {/* Overview cards */}
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Employees</div>
                                                    <div className="text-lg font-bold">23</div>
                                                    <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
                                                        <span className="flex items-center"><ArrowRight className="w-3 h-3 mr-1" /> +2</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">RPSC</div>
                                                    <div className="text-lg font-bold">47,500</div>
                                                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                        <span>≈ $47,500</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Next Pay</div>
                                                    <div className="text-lg font-bold">May 28</div>
                                                    <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                                        <span>In 3 days</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Employee list - focused on current demo step */}
                                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 font-medium text-sm">
                                                    Recent Employees
                                                </div>
                                                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                                    {[
                                                        { name: "Alex Thompson", tag: "@alexthompson", amount: "3,500 RPSC" },
                                                        { name: "Maria Rodriguez", tag: "@mariar", amount: "2,800 RPSC" },
                                                        { name: "John Doe", tag: "@johndoe", amount: "4,200 RPSC" }
                                                    ].map((employee, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex justify-between items-center px-3 py-2 ${demoStep === i ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                                                                    {employee.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">{employee.name}</div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{employee.tag}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-medium text-sm">{employee.amount}</div>
                                                                {demoStep === i && (
                                                                    <div className="text-xs text-green-600 dark:text-green-400">
                                                                        <CheckCircle className="w-3 h-3 inline mr-1" /> Paid
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
            {isUserTypeModalOpen && (
                <Dialog open={isUserTypeModalOpen} onOpenChange={setIsUserTypeModalOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-0 rounded-xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                Select Your Account Type
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400">
                                Choose the type of account you want to create. This will customize your experience.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <RadioGroup
                                value={selectedUserType}
                                onValueChange={(value) => setSelectedUserType(value as "recipient" | "business")}
                                className="space-y-4"
                            >
                                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer bg-white dark:bg-slate-800/60 transition-colors">
                                    <RadioGroupItem value="recipient" id="recipient" className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor="recipient" className="text-base font-medium cursor-pointer">
                                            <User className="h-5 w-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                                            Individual User
                                        </Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                            For personal use, freelancers, and individuals receiving payments
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer bg-white dark:bg-slate-800/60 transition-colors">
                                    <RadioGroupItem value="business" id="business" className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor="business" className="text-base font-medium cursor-pointer">
                                            <Briefcase className="h-5 w-5 inline mr-2 text-teal-600 dark:text-teal-400" />
                                            Business Account
                                        </Label>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 ml-7">
                                            For companies, organizations, and businesses managing payroll
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <DialogFooter>
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                onClick={handleUserTypeSelection}
                            >
                                Continue
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {isRedirecting && (
                <Dialog open={isRedirecting} onOpenChange={() => { }}>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-0 rounded-xl">
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                <Tag className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                Setting Up Your PayTag
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                You need to create your unique @PayTag before continuing. Redirecting you to the registration page...
                            </p>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 animate-pulse" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
};

export default DesktopHeroSection;