"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Eye, Loader2, BadgeCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateAddress } from "@/lib/utils";
import { useState } from "react";

interface Asset {
    id: number;
    name: string;
    value: string;
    owner: string;
    verified: boolean;
}

interface AssetListProps {
    assets: Asset[];
    loading: boolean;
    onSelect: (id: number) => void;
    emptyMessage: string;
    isAdmin?: boolean;
    contract?: ethers.Contract | null;
    onSuccess?: () => void;
}

export function AssetList({
    assets,
    loading,
    onSelect,
    emptyMessage,
    isAdmin = false,
    contract = null,
    onSuccess = () => { },
}: AssetListProps) {
    const [verifyingId, setVerifyingId] = useState<number | null>(null);

    const handleVerifyAsset = async (id: number) => {
        if (!contract) return;

        setVerifyingId(id);

        try {
            const tx = await contract.verifyAsset(id);
            toast.loading(`Verifying asset #${id}...`, { id: "verify-asset" });

            await tx.wait();

            toast.success("Asset verified successfully!", { id: "verify-asset" });
            onSuccess();
        } catch (error: any) {
            console.error("Error verifying asset:", error);
            toast.error(`Failed to verify asset: ${error.message || "Unknown error"}`, { id: "verify-asset" });
        } finally {
            setVerifyingId(null);
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
                    <CardTitle className="text-lg">
                        {isAdmin ? "All Registered Assets" : "My Assets"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                            <p>{emptyMessage}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Value (RSC)</TableHead>
                                        {isAdmin && <TableHead>Owner</TableHead>}
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assets.map((asset) => (
                                        <TableRow key={asset.id}>
                                            <TableCell className="font-medium">{asset.id}</TableCell>
                                            <TableCell>{asset.name}</TableCell>
                                            <TableCell>{asset.value}</TableCell>
                                            {isAdmin && (
                                                <TableCell className="font-mono text-xs">
                                                    {truncateAddress(asset.owner)}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                {asset.verified ? (
                                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-amber-600 dark:text-amber-400">
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Unverified
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onSelect(asset.id)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    {isAdmin && !asset.verified && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-950"
                                                            onClick={() => handleVerifyAsset(asset.id)}
                                                            disabled={verifyingId === asset.id}
                                                        >
                                                            {verifyingId === asset.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <BadgeCheck className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}