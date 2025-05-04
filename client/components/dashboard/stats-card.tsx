"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    loading?: boolean;
    change?: string;
    trend?: "up" | "down" | "neutral";
}

export function StatsCard({
    title,
    value,
    icon,
    loading = false,
    change,
    trend,
}: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {title}
                            </p>
                            {loading ? (
                                <Skeleton className="h-8 w-32 mt-1" />
                            ) : (
                                <p className="text-2xl font-bold">{value}</p>
                            )}

                            {change && (
                                <div className="flex items-center mt-2">
                                    <span
                                        className={`flex items-center text-xs font-medium ${trend === "up"
                                                ? "text-green-600"
                                                : trend === "down"
                                                    ? "text-red-600"
                                                    : "text-slate-600"
                                            }`}
                                    >
                                        {trend === "up" ? (
                                            <ArrowUp className="h-3 w-3 mr-1" />
                                        ) : trend === "down" ? (
                                            <ArrowDown className="h-3 w-3 mr-1" />
                                        ) : null}
                                        {change}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}