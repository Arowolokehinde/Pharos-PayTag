"use client";

import { FC, useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WalletConnect from "@/components/auth/wallet-connect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ExternalLink,
    Shield,
    Globe,
    Lock,
    CheckCircle
} from "lucide-react";

const EnhancedCTASection: FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax effect on scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    // Track mouse position for interactive background
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (containerRef.current) {
                const { left, top, width, height } = containerRef.current.getBoundingClientRect();
                const x = ((event.clientX - left) / width) - 0.5;
                const y = ((event.clientY - top) / height) - 0.5;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Security features for the left side
    const securityFeatures = [
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Enterprise Security",
            description: "Bank-grade encryption and multi-signature protection"
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: "Global Compliance",
            description: "Adherence to international financial regulations"
        },
        {
            icon: <Lock className="w-5 h-5" />,
            title: "Asset Protection",
            description: "Real-world asset backing with legal safeguards"
        }
    ];

    return (
        <section ref={containerRef} className="py-14 px-4 w-full overflow-hidden relative bg-gradient-to-br from-slate-100 via-blue-100/20 to-slate-100 dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-950">
            {/* Curved corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-br-[100px] bg-indigo-100/50 dark:bg-indigo-900/20 -z-5"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-[100px] bg-teal-100/50 dark:bg-teal-900/20 -z-5"></div>

            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div
                    style={{ y }}
                    className="flex flex-col lg:flex-row gap-6 items-center"
                >
                    {/* Left side: Features and benefits - MADE MORE COMPACT with CURVY BORDERS */}
                    <div className="w-full lg:w-5/12 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="p-5 lg:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-indigo-200/70 dark:border-indigo-700/50 rounded-[24px] rounded-bl-[5px] rounded-tr-[48px] shadow-lg"
                            style={{
                                borderRadius: "24px 48px 24px 5px",
                                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.05)"
                            }}
                        >
                            <motion.h3
                                className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Enterprise-Grade Platform
                            </motion.h3>

                            <div className="space-y-4">
                                {securityFeatures.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-start space-x-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex-shrink-0 w-9 h-9 rounded-2xl rounded-bl-sm bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{feature.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-300 text-xs">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-5 pl-12">
                                <div className="flex flex-wrap gap-2">
                                    {["SOC 2", "GDPR", "AML", "KYC"].map((cert, i) => (
                                        <motion.div
                                            key={i}
                                            className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-xs font-medium text-indigo-700 dark:text-indigo-300 rounded-xl rounded-bl-sm flex items-center"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.6 + i * 0.05 }}
                                            viewport={{ once: true }}
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                            {cert}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side: CTA card - with CURVY STYLISH BORDERS */}
                    <div className="w-full lg:w-7/12 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden rounded-3xl rounded-tr-[70px] rounded-bl-[40px]"
                            style={{
                                borderRadius: "30px 70px 30px 40px",
                                boxShadow: "0 20px 30px -10px rgba(14, 165, 233, 0.3), 0 10px 15px -5px rgba(20, 184, 166, 0.2)"
                            }}
                        >
                            {/* Card background with advanced gradient */}
                            <div className="absolute inset-0 z-0">
                                {/* Curvy clip path */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        clipPath: "polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
                                    }}
                                >
                                    {/* Primary gradient - UPDATED COLOR SCHEME */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(125deg, #4F46E5 0%, #0EA5E9 50%, #14B8A6 100%)`,
                                            opacity: 0.9
                                        }}
                                    ></div>
                                </div>

                                {/* Mesh pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <pattern id="dots" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="scale(2)">
                                            <circle cx="2" cy="2" r="1" fill="white"></circle>
                                        </pattern>
                                        <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
                                    </svg>
                                </div>

                                {/* Corner decorations for added style */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full"></div>

                                {/* Interactive subtle shine effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                                    style={{
                                        backgroundPosition: `${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%`
                                    }}
                                ></motion.div>
                            </div>

                            <div className="relative z-10 p-6 md:p-8 text-white text-center">
                                <motion.h2
                                    className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    Ready to Revolutionize Your Payments?
                                </motion.h2>

                                <motion.p
                                    className="mb-6 text-white/90 text-base max-w-2xl mx-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    Connect your wallet and start exploring the future of decentralized finance today.
                                    Our platform integrates multiple blockchain solutions in one seamless interface.
                                </motion.p>

                                <motion.div
                                    className="flex flex-wrap justify-center gap-4 mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    {/* UPDATED BUTTON STYLING with CURVY SHAPES */}
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <WalletConnect className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 font-semibold shadow-lg shadow-indigo-900/20 min-w-[160px] h-10 rounded-xl rounded-tr-sm" />
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Link href="/dashboard">
                                            <Button
                                                variant="outline"
                                                className="border-white text-white bg-white/10 hover:bg-white/20 font-medium px-6 h-10 min-w-[160px] rounded-xl rounded-bl-sm"
                                            >
                                                Explore Features
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    className="pt-5 border-t border-white/20 flex flex-wrap justify-center gap-6 text-white/80"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    {[
                                        { text: "Documentation", href: "/docs" },
                                        { text: "FAQs", href: "/faq" },
                                        { text: "Contact Us", href: "/contact" }
                                    ].map((link, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 3 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link href={link.href} className="flex items-center hover:text-white transition-colors text-sm">
                                                <span>{link.text}</span>
                                                <ExternalLink className="ml-1 w-3.5 h-3.5" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default EnhancedCTASection;

