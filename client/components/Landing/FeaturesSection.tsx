"use client";

import { FC, useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
    PiggyBank,
    Users,
    Tag,
    Building,
    Smartphone,
    Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
    title: string;
    description: string;
    icon: JSX.Element;
    bgColor: string;
    borderColor: string;
}

const EnhancedFeaturesSection: FC = () => {
    const [activeFeatureIndex, setActive] = useState<number | null>(null);
    const controls = useAnimation();


    // Animate when feature changes
    useEffect(() => {
        if (activeFeatureIndex !== null) {
            controls.start("visible");
        }
    }, [activeFeatureIndex, controls]);

    const features: Feature[] = [
        {
            title: "StableCoin Management",
            description: "Mint, burn, and manage your RealStableCoin tokens backed by real-world assets.",
            icon: <PiggyBank className="w-5 h-5" />,
            bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
            borderColor: "border-blue-500/30 dark:border-blue-500/40"
        },
        {
            title: "Payroll System",
            description: "Manage employee payroll seamlessly on the blockchain. Schedule automated payments.",
            icon: <Users className="w-5 h-5" />,
            bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
            borderColor: "border-teal-500/30 dark:border-teal-500/40"
        },
        {
            title: "PayTag Registry",
            description: "Register and manage custom tags for wallet addresses. Send money using @username.",
            icon: <Tag className="w-5 h-5" />,
            bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
            borderColor: "border-purple-500/30 dark:border-purple-500/40"
        },
        {
            title: "RWA Asset Registry",
            description: "Register and verify real-world assets on-chain. Tokenize real estate and bonds.",
            icon: <Building className="w-5 h-5" />,
            bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
            borderColor: "border-indigo-500/30 dark:border-indigo-500/40"
        },
        {
            title: "Airtime Converter",
            description: "Convert airtime to stablecoins across multiple networks with instant settlements.",
            icon: <Smartphone className="w-5 h-5" />,
            bgColor: "bg-green-500/10 dark:bg-green-500/20",
            borderColor: "border-green-500/30 dark:border-green-500/40"
        },
        {
            title: "Secure Locks",
            description: "Lock and secure your funds with time-based withdrawals and multi-signature approvals.",
            icon: <Lock className="w-5 h-5" />,
            bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
            borderColor: "border-amber-500/30 dark:border-amber-500/40"
        },
    ];

    // 3D card hover effect
    const FeatureCard: FC<{ feature: Feature, index: number }> = ({ feature, index }) => {
        const cardRef = useRef<HTMLDivElement>(null);
        const [rotateX, setRotateX] = useState(0);
        const [rotateY, setRotateY] = useState(0);
        const [scale, setScale] = useState(1);
        const isActive = index === activeFeatureIndex;

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!cardRef.current) return;
            const card = cardRef.current;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const max = 10;

            setRotateX(-y / rect.height * max);
            setRotateY(x / rect.width * max);
        };

        const handleMouseLeave = () => {
            setRotateX(0);
            setRotateY(0);
            setScale(1);
        };

        const handleMouseEnter = () => {
            setScale(1.05);
        };

        const cardVariants = {
            hidden: { opacity: 0, y: 15 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: index * 0.08
                }
            }
        };

        const hoverVariants = {
            initial: {
                boxShadow: "0px 0px 0px rgba(59, 130, 246, 0)",
                borderColor: "rgba(226, 232, 240, 0.6)"
            },
            hover: {
                boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(59, 130, 246, 0.3)",
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }
            }
        };

        const pulseVariants = {
            inactive: {
                scale: 1,
                boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)"
            },
            active: {
                scale: [1, 1.05, 1],
                transition: {
                    scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }
                }
            }
        };

        return (
            <motion.div
                ref={cardRef}
                className="relative"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                style={{
                    transformStyle: "preserve-3d",
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                    transition: "transform 0.2s ease-out",
                }}
            >
                <motion.div
                    initial="initial"
                    whileHover="hover"
                    variants={hoverVariants}
                    className="h-full w-full"
                >
                    <Card
                        className={`h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden relative z-10 ${isActive ? 'ring-1 ring-blue-500/30 dark:ring-blue-500/40' : ''}`}
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start">

                                <motion.div
                                    className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-0 mr-4 ${isActive ? feature.borderColor : ''} border`}
                                    variants={pulseVariants}
                                    animate={isActive ? "active" : "inactive"}
                                >
                                    {feature.icon}
                                </motion.div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            </div>

                            {/* Decorative corner element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-tl from-blue-500/5 to-teal-500/5 dark:from-blue-500/10 dark:to-teal-500/10" />
                        </CardContent>
                    </Card>
                </motion.div>


            </motion.div>
        );
    };

    return (
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/30 relative overflow-hidden">

            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                        Everything you need to manage your finances in the Web3 world
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EnhancedFeaturesSection;

