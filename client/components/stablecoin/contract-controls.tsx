"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Play, Pause, RefreshCw } from "lucide-react";

interface ContractControlsProps {
    contract: ethers.Contract | null;
    isPaused: boolean;
    onStatusChange: (newStatus: boolean) => void;
}

export function ContractControls({
    contract,
    isPaused,
    onStatusChange,
}: ContractControlsProps) {
    const [loading, setLoading] = useState(false);

    const togglePause = async () => {
        if (!contract) return;

        setLoading(true);

        try {
            const tx = isPaused
                ? await contract.unpause()
                : await contract.pause();

            toast.loading(
                isPaused ? "Unpausing contract..." : "Pausing contract...",
                { id: "pause" }
            );

            await tx.wait();

            toast.success(
                isPaused
                    ? "Contract unpaused successfully!"
                    : "Contract paused successfully!",
                { id: "pause" }
            );

            onStatusChange(!isPaused);
        } catch (error: any) {
            console.error("Error toggling pause state:", error);
            toast.error(`Failed to update contract status: ${error.message || "Unknown error"}`, { id: "pause" });
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
                    <CardTitle className="text-lg">Contract Controls</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-4">
                                {isPaused ? (
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <Pause className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium">Contract Status</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {isPaused
                                            ? "Contract is paused. All transfers are disabled."
                                            : "Contract is active and functioning normally."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="contract-status"
                                    checked={!isPaused}
                                    onCheckedChange={() => togglePause()}
                                    disabled={loading}
                                />
                                <Label htmlFor="contract-status" className="sr-only">
                                    Toggle contract status
                                </Label>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <h3 className="text-sm font-medium mb-2">Other Actions</h3>
                            <Button
                                variant="outline"
                                className="justify-start"
                                disabled={loading}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh Contract State
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}