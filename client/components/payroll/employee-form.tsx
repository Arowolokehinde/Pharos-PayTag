"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface EmployeeFormProps {
    contract: ethers.Contract | null;
    onSuccess: () => void;
}

export function EmployeeForm({ contract, onSuccess }: EmployeeFormProps) {
    const [wallet, setWallet] = useState("");
    const [salary, setSalary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        if (!wallet) {
            setError("Wallet address is required");
            return false;
        }

        if (!ethers.isAddress(wallet)) {
            setError("Invalid wallet address");
            return false;
        }

        if (!salary || parseFloat(salary) <= 0) {
            setError("Salary must be greater than 0");
            return false;
        }

        setError(null);
        return true;
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !contract) return;

        setLoading(true);

        try {
            // Convert salary to wei (considering 18 decimals)
            const salaryInWei = ethers.parseEther(salary);

            const tx = await contract.addEmployee(wallet, salaryInWei);
            toast.loading("Adding employee...", { id: "add-employee" });

            await tx.wait();

            toast.success("Employee added successfully!", { id: "add-employee" });
            setWallet("");
            setSalary("");
            onSuccess();
        } catch (error: any) {
            console.error("Error adding employee:", error);
            toast.error(`Failed to add employee: ${error.message || "Unknown error"}`, { id: "add-employee" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Add New Employee</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddEmployee}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="wallet">Employee Wallet Address</Label>
                                <Input
                                    id="wallet"
                                    placeholder="0x..."
                                    value={wallet}
                                    onChange={(e) => setWallet(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary">Monthly Salary</Label>
                                <div className="relative">
                                    <Input
                                        id="salary"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)}
                                        disabled={loading}
                                        className="pr-14"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        RSC
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Add Employee"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}