"use client";

import { FC, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    UserCircle2,
    Building2,
    CreditCard,
    Smartphone,
    ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WorkflowSection: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.95, 1, 1, 0.95]);

    const steps = [
        {
            title: "Get a PayTag",
            description: "Connect your wallet and choose a simple PayTag like @username that maps to your wallet. That's it!",
            icon: <UserCircle2 className="w-5 h-5" />,
            color: "from-blue-500 to-blue-600"
        },
        {
            title: "Employer Pays You",
            description: "Employers tokenize their Real-World Assets and deposit them into a smart contract to get stablecoins (RPSC).",
            icon: <Building2 className="w-5 h-5" />,
            color: "from-teal-500 to-teal-600"
        },
        {
            title: "Receive Payment",
            description: "Get RPSC stablecoins sent directly to your wallet and view your balance in your PayTag wallet.",
            icon: <CreditCard className="w-5 h-5" />,
            color: "from-indigo-500 to-indigo-600"
        },
        {
            title: "Spend Your Money",
            description: "Convert to airtime, send to friends via their PayTag, or withdraw to local currency.",
            icon: <Smartphone className="w-5 h-5" />,
            color: "from-green-500 to-green-600"
        }
    ];

    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        })
    };

    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: {
            scaleX: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section ref={containerRef} className="py-10 md:py-16 px-4 relative overflow-hidden">
            {/* Sophisticated background with layers and patterns */}
            <div className="absolute inset-0 -z-10">
                {/* Base background color - sophisticated cream/beige for light mode, deep slate for dark mode */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-slate-100 dark:from-slate-800 dark:to-slate-900" />

                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Soft highlight at the top */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent dark:from-blue-500/5 dark:to-transparent" />

                {/* Colored accent in corner */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 via-teal-500/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 via-teal-500/5 to-transparent rounded-tr-full" />
            </div>

            <div className="container mx-auto">
                <motion.div
                    style={{ opacity, scale }}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                                How RealPayTag Works
                            </span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                            A step-by-step walkthrough of our seamless workflow
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Mobile view (vertical line) */}
                        <div className="md:hidden absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-600 via-teal-500 to-green-500 z-0"></div>

                        {/* Desktop view (horizontal line) - animated growth */}
                        <motion.div
                            className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 z-0"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={lineVariants}
                        ></motion.div>

                        <div className="grid md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={variants}
                                    className="relative"
                                >
                                    <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/70 h-full transition-all duration-300 hover:shadow-md hover:bg-white dark:hover:bg-slate-800">
                                        <CardContent className="p-4 md:p-5">
                                            <div className="flex md:flex-col items-start md:items-center">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-0 md:mb-3 mr-3 md:mr-0 shadow-sm`}>
                                                    {step.icon}
                                                </div>
                                                <div className="md:text-center">
                                                    <h3 className="text-base font-semibold mb-1 mt-0.5 md:mt-0">{step.title}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Step connector for desktop - animated arrow */}
                                    {index < steps.length - 1 && (
                                        <motion.div
                                            className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-20"
                                            initial={{ x: -5, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center shadow-sm">
                                                <ArrowRight className="w-4 h-4 text-white" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Mobile step numbers */}
                                    <div className="absolute left-0 top-1/2 transform -translate-x-[19px] -translate-y-1/2 md:hidden">
                                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xs font-medium`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WorkflowSection;