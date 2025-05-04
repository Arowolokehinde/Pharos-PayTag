"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useState } from "react";

interface Asset {
    id: number;
    name: string;
    value: string;
    owner: string;
    verified: boolean;
}

interface AssetCardProps {
    asset: Asset | null;
    isAdmin: boolean;
    contract: ethers.Contract | null;
    onSuccess: () => void;
}

export function AssetCard({
    asset,
    isAdmin,
    contract,
    onSuccess,
}: AssetCardProps) {
    const [verifying, setVerifying] = useState(false);

    if (!asset) {
        return null;
    }

    const handleVerifyAsset = async () => {
        if (!contract) return;

        setVerifying(true);

        try {
            const tx = await contract.verifyAsset(asset.id);
            toast.loading(`Verifying asset #${asset.id}...`, { id: "verify-asset-detail" });

            await tx.wait();

            toast.success("Asset verified successfully!", { id: "verify-asset-detail" });
            onSuccess();
        } catch (error: any) {
            console.error("Error verifying asset:", error);
            toast.error(`Failed to verify asset: ${error.message || "Unknown error"}`, { id: "verify-asset-detail" });
        } finally {
            setVerifying(false);
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
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>
                            Asset #{asset.id}: {asset.name}
                        </span>
                        {asset.verified && (
                            <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <BadgeCheck className="h-4 w-4 mr-1" />
                                Verified
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Value</p>
                                <p className="text-xl font-semibold">
                                    {asset.value} <span className="text-sm text-slate-500">RSC</span>
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Owner</p>
                                <p className="text-sm font-mono overflow-x-auto">{asset.owner}</p>
                            </div>
                        </div>

                        {isAdmin && !asset.verified && (
                            <div className="pt-4">
                                <Button
                                    onClick={handleVerifyAsset}
                                    disabled={verifying}
                                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                                >
                                    {verifying ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            Verify Asset
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Additional details could go here */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Asset Information
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                This asset represents a real-world asset that has been registered on the blockchain.
                                {asset.verified
                                    ? " It has been verified by an administrator."
                                    : " It is pending verification by an administrator."}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}