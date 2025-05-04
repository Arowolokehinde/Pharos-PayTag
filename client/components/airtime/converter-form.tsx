"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Network {
    id: number;
    name: string;
    rate: string;
    active: boolean;
}

interface ConverterFormProps {
    networks: Network[];
    loading: boolean;
    contract: ethers.Contract | null;
}

export function ConverterForm({
    networks,
    loading,
    contract,
}: ConverterFormProps) {
    const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset converted amount when inputs change
    useEffect(() => {
        setConvertedAmount(null);
    }, [selectedNetworkId, amount]);

    const validateForm = () => {
        if (!selectedNetworkId) {
            setError("Please select a network");
            return false;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError("Amount must be greater than 0");
            return false;
        }

        setError(null);
        return true;
    };

    const calculateConversion = () => {
        if (!validateForm()) return;

        const network = networks.find((n) => n.id.toString() === selectedNetworkId);
        if (!network) return;

        const result = parseFloat(amount) * parseFloat(network.rate);
        setConvertedAmount(result.toFixed(2));
    };

    const handleConvertAirtime = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !contract) return;

        setActionLoading(true);

        try {
            // Convert amount to the correct format (assuming units in wei)
            const amountInWei = ethers.parseEther(amount);

            const tx = await contract.convertAirtime(
                parseInt(selectedNetworkId),
                amountInWei
            );
            toast.loading("Converting airtime...", { id: "convert-airtime" });

            await tx.wait();

            toast.success("Airtime converted successfully!", { id: "convert-airtime" });
            setAmount("");
            setSelectedNetworkId("");
            setConvertedAmount(null);
        } catch (error: any) {
            console.error("Error converting airtime:", error);
            toast.error(`Failed to convert airtime: ${error.message || "Unknown error"}`, { id: "convert-airtime" });
        } finally {
            setActionLoading(false);
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
                    <CardTitle className="text-lg">Convert Airtime to Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : networks.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                            <p>No active networks available for conversion.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleConvertAirtime}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="network">Select Network</Label>
                                    <Select
                                        value={selectedNetworkId}
                                        onValueChange={setSelectedNetworkId}
                                    >
                                        <SelectTrigger id="network">
                                            <SelectValue placeholder="Select network" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {networks.map((network) => (
                                                <SelectItem
                                                    key={network.id}
                                                    value={network.id.toString()}
                                                >
                                                    {network.name} (Rate: {network.rate})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Airtime Amount</Label>
                                    <div className="relative">
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            disabled={actionLoading}
                                            className="pr-14"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                            Units
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={calculateConversion}
                                        disabled={!selectedNetworkId || !amount || actionLoading}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        Calculate
                                    </Button>
                                </div>

                                {convertedAmount && (
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            You will receive:
                                        </p>
                                        <p className="text-2xl font-semibold">
                                            {convertedAmount} <span className="text-sm text-slate-500">RSC</span>
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium"
                                    disabled={actionLoading || !convertedAmount}
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Convert Airtime"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}