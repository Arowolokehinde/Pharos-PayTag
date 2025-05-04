"use client";

import { FC, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Zap, ShieldCheck, Coins } from "lucide-react";

const FixedBlockchainNetworksSection: FC = () => {
    const [hoveredNetwork, setHoveredNetwork] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.95, 1, 1, 0.95]);

    // Network icons as clearer SVG components
    const networks = [
        {
            name: "Pharos Blockchain",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6.67L6.67 13.33L20 20L33.33 13.33L20 6.67Z" fill="url(#pharos-gradient)" />
                    <path d="M6.67 13.33V26.67L20 33.33V20L6.67 13.33Z" fill="url(#pharos-gradient)" fillOpacity="0.7" />
                    <path d="M33.33 13.33V26.67L20 33.33V20L33.33 13.33Z" fill="url(#pharos-gradient)" fillOpacity="0.9" />
                    <circle cx="20" cy="12" r="1.67" fill="white" />
                    <defs>
                        <linearGradient id="pharos-gradient" x1="6.67" y1="6.67" x2="33.33" y2="33.33" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3B82F6" />
                            <stop offset="1" stopColor="#14B8A6" />
                        </linearGradient>
                    </defs>
                </svg>
            ),
            features: ["Native PayTag Integration", "Optimized for Payments", "Low Transaction Fees"],
            bgGradient: "from-blue-600 to-teal-500",
            description: "Our native blockchain tailored for seamless payments"
        },
        {
            name: "Ethereum",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33L5 20L20 26.67L35 20L20 3.33Z" fill="#3B82F6" />
                    <path d="M20 26.67L5 20L20 36.67L35 20L20 26.67Z" fill="#3B82F6" fillOpacity="0.6" />
                </svg>
            ),
            features: ["Smart Contracts", "DeFi Ecosystem", "Wide Adoption"],
            bgGradient: "from-blue-500 to-blue-600",
            description: "The foundation of decentralized applications"
        },
        {
            name: "Polygon",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33L10 10V23.33L20 30L30 23.33V10L20 3.33Z" fill="#8B5CF6" />
                </svg>
            ),
            features: ["Scalable", "Low Gas Fees", "Ethereum Compatible"],
            bgGradient: "from-purple-500 to-purple-600",
            description: "Layer 2 scaling solution with high throughput"
        },
        {
            name: "Arbitrum",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33L6.67 20L20 36.67L33.33 20L20 3.33Z" fill="#10B981" />
                </svg>
            ),
            features: ["Optimistic Rollup", "Fast Finality", "EVM Compatible"],
            bgGradient: "from-green-500 to-green-600",
            description: "Layer 2 solution with lower costs and high security"
        },
        {
            name: "Binance Smart Chain",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33L8.33 15L13.33 20L20 13.33L26.67 20L31.67 15L20 3.33Z" fill="#F59E0B" />
                    <path d="M20 26.67L13.33 20L8.33 25L20 36.67L31.67 25L26.67 20L20 26.67Z" fill="#F59E0B" />
                </svg>
            ),
            features: ["Fast Transactions", "Low Fees", "Cross-Chain Bridge"],
            bgGradient: "from-amber-500 to-amber-600",
            description: "Parallel blockchain with BNB as native currency"
        },
    ];

    // Feature icons
    const featureIcons = [
        <Zap key="zap" className="w-3.5 h-3.5" />,
        <ShieldCheck key="shield" className="w-3.5 h-3.5" />,
        <Coins key="coins" className="w-3.5 h-3.5" />
    ];

    return (
        <section ref={containerRef} className="py-16 px-4 relative overflow-hidden">
            {/* Sophisticated background with grid pattern */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Decorative elements */}
                <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto">
                <motion.div
                    style={{ opacity, scale }}
                    className="max-w-6xl mx-auto"
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
                                Multi-Chain Support
                            </span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                            RealPayTag works seamlessly across all major blockchain networks for global interoperability
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Network cards in a responsive grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                            {networks.map((network, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    onHoverStart={() => setHoveredNetwork(i)}
                                    onHoverEnd={() => setHoveredNetwork(null)}
                                    className={`relative group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/70 dark:border-slate-700/70 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${i === 0 ? 'md:col-span-1 lg:col-span-1 ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''}`}
                                >
                                    {/* Highlight for first (Pharos) network */}
                                    {i === 0 && (
                                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rotate-12 z-0"></div>
                                    )}

                                    {/* Content container */}
                                    <div className="relative z-10 p-4 flex flex-col h-full">
                                        {/* Network icon */}
                                        <div className={`w-12 h-12 mb-3 p-2 rounded-lg bg-gradient-to-br ${network.bgGradient} flex items-center justify-center text-white shadow-sm group-hover:shadow`}>
                                            {network.icon}
                                        </div>

                                        {/* Network name and description */}
                                        <h3 className="text-base font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {network.name}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                            {network.description}
                                        </p>

                                        {/* Network features */}
                                        <div className="mt-auto">
                                            <AnimatePresence mode="wait">
                                                {hoveredNetwork === i && (
                                                    <motion.div
                                                        key={`features-${i}`}
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-1 mb-2"
                                                    >
                                                        {network.features.map((feature, j) => (
                                                            <motion.div
                                                                key={j}
                                                                initial={{ opacity: 0, x: -5 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: j * 0.1 }}
                                                                className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300"
                                                            >
                                                                <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-${network.bgGradient.split(' ')[0].replace('from-', '')}-500/10`}>
                                                                    {featureIcons[j % featureIcons.length]}
                                                                </span>
                                                                {feature}
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <motion.div
                                                initial={{ opacity: 0.8 }}
                                                whileHover={{ opacity: 1, x: 2 }}
                                                className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400"
                                            >
                                                View Details <ArrowUpRight className="ml-1 w-3 h-3" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Connection visualization at the bottom */}
                    <div className="mt-8 flex justify-center">
                        <motion.div
                            className="w-full max-w-lg h-8 relative"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <svg className="w-full h-full" viewBox="0 0 300 30" preserveAspectRatio="none">
                                <path
                                    d="M20,15 C50,5 100,25 150,15 C200,5 250,25 280,15"
                                    stroke="url(#connection-gradient)"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeDasharray="5,5"
                                />
                                <defs>
                                    <linearGradient id="connection-gradient" x1="0" y1="0" x2="100%" y2="0">
                                        <stop stopColor="#3B82F6" />
                                        <stop offset="0.5" stopColor="#14B8A6" />
                                        <stop offset="1" stopColor="#3B82F6" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Animated dots */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"
                                    initial={{ left: "10%", opacity: 0 }}
                                    animate={{
                                        left: ["10%", "90%"],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        delay: i * 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FixedBlockchainNetworksSection;




