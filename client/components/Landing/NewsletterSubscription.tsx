"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
    Tag,
    Shield,
    Globe,
    ArrowRight,
    CheckCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsletterSubscriptionProps {
    className?: string;
}

const NewsletterSubscription: FC<NewsletterSubscriptionProps> = ({
    className = ""
}) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSuccess(true);
            setEmail("");

            // Reset success state after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error subscribing:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={`relative py-12 overflow-hidden ${className}`}>
            {/* Unique background with brand colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10">
                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem',
                    }}
                />

                {/* Animated gradient blobs */}
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

                                    {/* Compact Feature Pills */}
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
                                            disabled={isSubmitting}
                                            className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium"
                                        >
                                            {isSuccess ? (
                                                <>
                                                    Subscribed!
                                                    <CheckCircle className="ml-2 w-4 h-4" />
                                                </>
                                            ) : isSubmitting ? (
                                                <>
                                                    Subscribing...
                                                    <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                                                </>
                                            ) : (
                                                <>
                                                    Subscribe
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSubscription;