"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface MintFormProps {
    contract: ethers.Contract | null;
    isPaused: boolean;
    onSuccess: () => void;
}

export function MintForm({ contract, isPaused, onSuccess }: MintFormProps) {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        if (!recipient) {
            setError("Recipient address is required");
            return false;
        }

        if (!ethers.isAddress(recipient)) {
            setError("Invalid recipient address");
            return false;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError("Amount must be greater than 0");
            return false;
        }

        setError(null);
        return true;
    };

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !contract) return;

        setLoading(true);

        try {
            // Convert amount to wei (considering 18 decimals)
            const amountInWei = ethers.parseEther(amount);

            const tx = await contract.mint(recipient, amountInWei);
            toast.loading("Minting tokens...", { id: "mint" });

            await tx.wait();

            toast.success("Tokens minted successfully!", { id: "mint" });
            setRecipient("");
            setAmount("");
            onSuccess();
        } catch (error: any) {
            console.error("Error minting tokens:", error);
            toast.error(`Failed to mint tokens: ${error.message || "Unknown error"}`, { id: "mint" });
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
                    <CardTitle className="text-lg">Mint Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                    {isPaused ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-4 text-center">
                            <p className="text-red-600 dark:text-red-400">
                                Contract is paused. Minting is disabled.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleMint}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="recipient">Recipient Address</Label>
                                    <Input
                                        id="recipient"
                                        placeholder="0x..."
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <div className="relative">
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
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
                                    {loading ? "Processing..." : "Mint Tokens"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
