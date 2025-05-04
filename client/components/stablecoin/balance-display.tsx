"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BalanceDisplayProps {
    balance: string;
    totalSupply: string;
    loading: boolean;
    isPaused: boolean;
}

export function BalanceDisplay({
    balance,
    totalSupply,
    loading,
    isPaused,
}: BalanceDisplayProps) {
    return (
        <Card className="overflow-hidden h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your StableCoin</CardTitle>
            </CardHeader>
            <CardContent>
                {isPaused && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-3 mb-4 flex items-center gap-2"
                    >
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Contract is currently paused. Transfers are disabled.
                        </p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Your Balance
                        </p>
                        {loading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    {parseFloat(balance).toFixed(2)}
                                </h2>
                                <span className="text-slate-600 dark:text-slate-400">RSC</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Total Supply
                        </p>
                        {loading ? (
                            <Skeleton className="h-8 w-full" />
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-semibold">
                                    {parseFloat(totalSupply).toFixed(2)}
                                </h3>
                                <span className="text-slate-600 dark:text-slate-400">RSC</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Token Information
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Name</span>
                                <span className="font-medium">Real Stable Coin</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Symbol</span>
                                <span className="font-medium">RSC</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Decimals</span>
                                <span className="font-medium">18</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Status</span>
                                <span className={`font-medium ${isPaused ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                                    {isPaused ? "Paused" : "Active"}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}