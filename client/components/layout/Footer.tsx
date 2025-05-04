"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChevronRight,
    ExternalLink,
    Mail,
    Shield,
    Globe,
    Tag,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ModernFooter: FC = () => {
    const currentYear = new Date().getFullYear();
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [email, setEmail] = useState("");

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    const footerSections = [
        {
            title: "Features",
            links: [
                { label: "StableCoin", href: "/features/stablecoin" },
                { label: "Payroll", href: "/features/payroll" },
                { label: "PayTag Registry", href: "/features/paytag" },
                { label: "RWA Assets", href: "/features/rwa" }
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "/docs" },
                { label: "API", href: "/api" },
                { label: "Tutorials", href: "/tutorials" },
                { label: "FAQs", href: "/faqs" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookies" }
            ]
        }
    ];

    // Toggle mobile accordion
    const toggleSection = (index: number) => {
        setActiveSection(activeSection === index ? null : index);
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Add subscription logic here
        setEmail("");
    };

    return (
        <>
            {/* Newsletter Section - Separate from Footer */}
            {/* <section className="relative py-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10">
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                            backgroundSize: '4rem 4rem',
                        }}
                    />

                    <motion.div
                        className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-3xl"
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-100/30 dark:bg-teal-900/10 blur-3xl"
                        animate={{
                            x: [0, -30, 0],
                            y: [0, 20, 0],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                </div>

                <div className="container mx-auto px-4">
                    <div className="relative">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 p-8 rounded-3xl rounded-bl-[40px] rounded-tr-[70px] shadow-xl">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-full md:w-1/2">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7 }}
                                            viewport={{ once: true }}
                                            className="mb-2"
                                        >
                                            <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Stay Updated</h3>
                                            <p className="text-slate-600 dark:text-slate-300">Get the latest on product releases, ecosystem news, and exclusive offers.</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            viewport={{ once: true }}
                                            className="flex flex-wrap gap-2 mt-4"
                                        >
                                            {[
                                                { icon: <Tag className="w-3 h-3" />, label: "PayTag Updates" },
                                                { icon: <Shield className="w-3 h-3" />, label: "Security Alerts" },
                                                { icon: <Globe className="w-3 h-3" />, label: "Network News" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300 rounded-full">
                                                    {item.icon}
                                                    <span className="ml-1">{item.label}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <motion.form
                                            onSubmit={handleSubscribe}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.7, delay: 0.3 }}
                                            viewport={{ once: true }}
                                            className="space-y-3"
                                        >
                                            <div className="flex flex-col space-y-1">
                                                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Email address
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    placeholder="your@email.com"
                                                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="privacy"
                                                    type="checkbox"
                                                    required
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="privacy" className="ml-2 text-xs text-slate-600 dark:text-slate-400">
                                                    I agree to receive updates about RealPayTag
                                                </label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium"
                                            >
                                                Subscribe
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </motion.form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Main Footer */}
            <footer className="bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden">
                {/* Subtle branding elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Diagonal lines pattern */}
                    <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="diagonalLines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#diagonalLines)" />
                    </svg>

                    {/* Accent colors */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-600/5 blur-3xl"></div>
                </div>

                <div className="container mx-auto py-10 px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 lg:gap-8">
                        {/* Brand column */}
                        <div className="col-span-2 md:col-span-1">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={0}
                                variants={fadeInUp}
                            >
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent">RealPayTag</h3>
                                    <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
                                </div>

                                <p className="text-slate-400 text-sm mb-5">Decentralized finance platform for seamless payments backed by real-world assets.</p>

                                <div className="flex space-x-3">
                                    {[
                                        { href: "https://twitter.com", label: "Twitter", color: "hover:bg-blue-600" },
                                        { href: "https://github.com", label: "GitHub", color: "hover:bg-slate-700" },
                                        { href: "https://discord.com", label: "Discord", color: "hover:bg-indigo-600" },
                                        { href: "https://linkedin.com", label: "LinkedIn", color: "hover:bg-blue-700" }
                                    ].map((social, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <Link
                                                href={social.href}
                                                className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 ${social.color} transition-colors`}
                                                aria-label={social.label}
                                            >
                                                {social.label.charAt(0)}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Menu columns */}
                        {footerSections.map((section, index) => (
                            <div key={index}>
                                {/* Desktop view */}
                                <motion.div
                                    className="hidden md:block"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={index + 1}
                                    variants={fadeInUp}
                                >
                                    <h4 className="text-sm font-medium mb-3 relative">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-2 text-sm">
                                        {section.links.map((link, i) => (
                                            <motion.li key={i}>
                                                <Link
                                                    href={link.href}
                                                    className="text-slate-400 hover:text-blue-400 transition-colors flex items-center group"
                                                >
                                                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {link.label}
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Mobile accordion */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() => toggleSection(index)}
                                        className="flex items-center justify-between w-full py-2 border-b border-slate-800 text-sm font-medium"
                                    >
                                        {section.title}
                                        <motion.div
                                            animate={{ rotate: activeSection === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </motion.div>
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: activeSection === index ? 'auto' : 0,
                                            opacity: activeSection === index ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="space-y-2 py-2 text-sm">
                                            {section.links.map((link, i) => (
                                                <li key={i}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-slate-400 hover:text-blue-400 transition-colors block"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-slate-500 text-xs text-center md:text-left">© {currentYear} RealPayTag. All rights reserved.</p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>SOC 2</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>GDPR</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>KYC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default ModernFooter;

