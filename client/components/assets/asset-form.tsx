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

interface AssetFormProps {
    contract: ethers.Contract | null;
    onSuccess: () => void;
}

export function AssetForm({ contract, onSuccess }: AssetFormProps) {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        if (!name) {
            setError("Asset name is required");
            return false;
        }

        if (!value || parseFloat(value) <= 0) {
            setError("Value must be greater than 0");
            return false;
        }

        setError(null);
        return true;
    };

    const handleRegisterAsset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !contract) return;

        setLoading(true);

        try {
            // Convert value to wei (considering 18 decimals)
            const valueInWei = ethers.parseEther(value);

            const tx = await contract.registerAsset(name, valueInWei);
            toast.loading("Registering asset...", { id: "register-asset" });

            await tx.wait();

            toast.success("Asset registered successfully!", { id: "register-asset" });
            setName("");
            setValue("");
            onSuccess();
        } catch (error: any) {
            console.error("Error registering asset:", error);
            toast.error(`Failed to register asset: ${error.message || "Unknown error"}`, { id: "register-asset" });
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
                    <CardTitle className="text-lg">Register New Asset</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegisterAsset}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Asset Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter asset name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">Asset Value</Label>
                                <div className="relative">
                                    <Input
                                        id="value"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
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
                                    "Register Asset"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}