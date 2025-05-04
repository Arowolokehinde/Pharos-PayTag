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
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Network {
    id: number;
    name: string;
    rate: string;
    active: boolean;
}

interface NetworkListProps {
    networks: Network[];
    loading: boolean;
}

export function NetworkList({ networks, loading }: NetworkListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Available Networks</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : networks.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                            <p>No networks available yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Network</TableHead>
                                        <TableHead>Rate (RSC/Unit)</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {networks.map((network) => (
                                        <TableRow key={network.id}>
                                            <TableCell className="font-medium">{network.id}</TableCell>
                                            <TableCell>{network.name}</TableCell>
                                            <TableCell>{network.rate}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${network.active
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                    }`}>
                                                    {network.active ? "Active" : "Inactive"}
                                                </span>
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