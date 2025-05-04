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

interface NetworkFormProps {
    contract: ethers.Contract | null;
    onSuccess: () => void;
}

export function NetworkForm({ contract, onSuccess }: NetworkFormProps) {
    const [name, setName] = useState("");
    const [rate, setRate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        if (!name) {
            setError("Network name is required");
            return false;
        }

        if (!rate || parseFloat(rate) <= 0) {
            setError("Rate must be greater than 0");
            return false;
        }

        setError(null);
        return true;
    };

    const handleAddNetwork = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !contract) return;

        setLoading(true);

        try {
            // Convert rate to the correct format (assuming 2 decimals for rates)
            const rateFormatted = ethers.parseUnits(rate, 2);

            const tx = await contract.addNetwork(name, rateFormatted);
            toast.loading("Adding network...", { id: "add-network" });

            await tx.wait();

            toast.success("Network added successfully!", { id: "add-network" });
            setName("");
            setRate("");
            onSuccess();
        } catch (error: any) {
            console.error("Error adding network:", error);
            toast.error(`Failed to add network: ${error.message || "Unknown error"}`, { id: "add-network" });
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
                    <CardTitle className="text-lg">Add New Network</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddNetwork}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Network Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter network name (e.g. MTN, Airtel)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rate">Conversion Rate</Label>
                                <div className="relative">
                                    <Input
                                        id="rate"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        disabled={loading}
                                        className="pr-16"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        RSC/Unit
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    How many RSC tokens per 1 unit of airtime.
                                </p>
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
                                    "Add Network"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}