"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface Employee {
    id: number;
    wallet: string;
    salary: string;
    lastPayoutTime: number;
    active: boolean;
}

interface PayrollActionsProps {
    contract: ethers.Contract | null;
    employees: Employee[];
    onSuccess: () => void;
}

export function PayrollActions({
    contract,
    employees,
    onSuccess,
}: PayrollActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleProcessPayroll = async () => {
        if (!contract) return;

        setLoading(true);

        try {
            const tx = await contract.processPayroll();
            toast.loading("Processing payroll...", { id: "process-payroll" });

            await tx.wait();

            toast.success("Payroll processed successfully!", { id: "process-payroll" });
            onSuccess();
        } catch (error: any) {
            console.error("Error processing payroll:", error);
            toast.error(`Failed to process payroll: ${error.message || "Unknown error"}`, { id: "process-payroll" });
        } finally {
            setLoading(false);
        }
    };

    // Filter active employees
    const activeEmployees = employees.filter(e => e.active);

    // Calculate eligible employees (last payout was more than 30 days ago or never paid)
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const eligibleEmployees = activeEmployees.filter(
        e => e.lastPayoutTime === 0 || now - e.lastPayoutTime >= thirtyDaysInSeconds
    );

    // Calculate total salary to be paid
    const totalSalary = eligibleEmployees.reduce(
        (sum, e) => sum + parseFloat(e.salary),
        0
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Process Payroll</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Employees</p>
                                <p className="text-2xl font-semibold">{activeEmployees.length}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Eligible for Payment</p>
                                <p className="text-2xl font-semibold">{eligibleEmployees.length}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Payout</p>
                                <p className="text-2xl font-semibold">
                                    {totalSalary.toFixed(2)} <span className="text-sm text-slate-500">RSC</span>
                                </p>
                            </div>
                        </div>

                        {activeEmployees.length === 0 ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300">No Active Employees</h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                        There are no active employees in the system. Add employees before processing payroll.
                                    </p>
                                </div>
                            </div>
                        ) : eligibleEmployees.length === 0 ? (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-800 dark:text-blue-300">No Eligible Employees</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                        None of the employees are eligible for payment yet. Employees become eligible 30 days after their last payout.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-green-800 dark:text-green-300">Ready to Process</h4>
                                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                        {eligibleEmployees.length} employees are eligible for payment, with a total of {totalSalary.toFixed(2)} RSC.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleProcessPayroll}
                            disabled={loading || eligibleEmployees.length === 0}
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Process Payroll"
                            )}
                        </Button>

                        {eligibleEmployees.length > 0 && (
                            <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                This will process payments for all eligible employees. Make sure you have enough tokens.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}