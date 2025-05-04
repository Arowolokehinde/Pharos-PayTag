"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Laptop, Globe, UserCircle, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UseCase {
    title: string;
    description: string;
    icon: JSX.Element;
    color: string;
    user: string;
    scenario: string;
}

const CompactUseCasesSection: FC = () => {
    const useCases: UseCase[] = [
        {
            title: "Remote Freelancers",
            description: "Get paid instantly for your work in stable tokens, without high fees or delays.",
            icon: <Laptop className="w-8 h-8" />,
            color: "from-blue-500 to-blue-600",
            user: "Freelancer in Berlin",
            scenario: "Working for a company in Dubai"
        },
        {
            title: "Virtual Assistants",
            description: "Receive your salary in one click, convertible to airtime or local currency.",
            icon: <UserCircle className="w-8 h-8" />,
            color: "from-teal-500 to-teal-600",
            user: "Virtual Assistant in Manila",
            scenario: "Supporting a business in London"
        },
        {
            title: "Remote Employers",
            description: "Pay your global team without the complexity of international banking.",
            icon: <Building className="w-8 h-8" />,
            color: "from-indigo-500 to-indigo-600",
            user: "Tech Company in New York",
            scenario: "Managing a distributed team across 12 countries"
        },
        {
            title: "International Businesses",
            description: "Tokenize real-world assets to back your global payroll operations.",
            icon: <Globe className="w-8 h-8" />,
            color: "from-purple-500 to-purple-600",
            user: "E-commerce Business",
            scenario: "Handling payments to suppliers worldwide"
        }
    ];

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                            Designed for Global Users
                        </span>
                    </h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                        See how RealPayTag solves real problems for users worldwide
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="relative rounded-2xl overflow-hidden shadow-lg group h-full flex flex-col"
                        >
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"></div>

                            {/* Content */}
                            <div className="relative p-6 flex-1 flex flex-col">
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center text-white`}>
                                        {useCase.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{useCase.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1">{useCase.description}</p>
                                    </div>
                                </div>

                                <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-lg mt-auto mb-4">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span className="font-bold">{useCase.user}</span> • {useCase.scenario}
                                    </p>
                                </div>

                                <motion.div
                                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium"
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                >
                                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                                </motion.div>
                            </div>

                            {/* Decoration element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full transform origin-top-right transition-transform duration-300 group-hover:scale-150"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CompactUseCasesSection;

