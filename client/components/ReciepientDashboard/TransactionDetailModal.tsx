"use client";

import { FC } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    ArrowRight,
    Send,
    Smartphone,
    BarChart3,
    Copy,
    CheckCircle,
    Clock,
    AlertTriangle,
    ExternalLink,
    Calendar,
    User,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Transaction } from "./TransactionItem";

interface TransactionDetailModalProps {
    transaction: Transaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TransactionDetailModal: FC<TransactionDetailModalProps> = ({
    transaction,
    open,
    onOpenChange,
}) => {
    if (!transaction) return null;

    // Get icon based on transaction type
    const getIcon = () => {
        switch (transaction.type) {
            case "received":
                return <ArrowRight className="h-5 w-5" />;
            case "sent":
                return <Send className="h-5 w-5" />;
            case "airtime":
                return <Smartphone className="h-5 w-5" />;
            case "staking":
                return <BarChart3 className="h-5 w-5" />;
        }
    };

    // Get color based on transaction type
    const getTypeColor = () => {
        switch (transaction.type) {
            case "received":
                return "bg-gradient-to-br from-green-500 to-emerald-600 text-white";
            case "sent":
                return "bg-gradient-to-br from-blue-600 to-teal-500 text-white";
            case "airtime":
                return "bg-gradient-to-br from-purple-600 to-blue-500 text-white";
            case "staking":
                return "bg-gradient-to-br from-amber-500 to-yellow-600 text-white";
        }
    };

    // Get color based on status
    const getStatusColor = () => {
        switch (transaction.status) {
            case "completed":
                return "text-green-600 dark:text-green-400";
            case "pending":
                return "text-amber-600 dark:text-amber-400";
            case "failed":
                return "text-red-600 dark:text-red-400";
        }
    };

    // Get status icon
    const getStatusIcon = () => {
        switch (transaction.status) {
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
            case "pending":
                return <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
            case "failed":
                return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
        }
    };

    // Get color for amount
    const getAmountColor = () => {
        if (transaction.amount.startsWith("+")) {
            return "bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent";
        } else if (transaction.amount.startsWith("-")) {
            return "text-slate-700 dark:text-slate-300";
        }
        return "text-slate-900 dark:text-white";
    };

    const detailItems = [
        {
            label: "Transaction ID",
            value: transaction.id,
            icon: <FileText className="h-4 w-4 text-slate-400" />,
            copyable: true
        },
        {
            label: "Date & Time",
            value: `${transaction.date}, 10:45 AM`,
            icon: <Calendar className="h-4 w-4 text-slate-400" />
        },
        {
            label: transaction.type === "received" ? "From" : "To",
            value: transaction.subtitle.replace("From: ", "").replace("To: ", ""),
            icon: <User className="h-4 w-4 text-slate-400" />
        },
        {
            label: "Status",
            value: transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1),
            icon: getStatusIcon(),
            statusColor: getStatusColor()
        }
    ];

    // Animation variants for the content
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-md border-0 shadow-lg  overflow-hidden fixed bottom-25 left-1/2 transform -translate-x-1/2"
                style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto"
                }}
            >
                {/* Decorative gradient border */}
                <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                </div>

                {/* Gradient top border */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10 -mt-6 -mx-6"></div>

                <div className="relative z-10">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-3">
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center shadow-md mx-auto",
                                getTypeColor()
                            )}>
                                {getIcon()}
                            </div>
                        </div>
                        <DialogTitle className="text-xl font-bold">{transaction.title}</DialogTitle>
                        <DialogDescription>
                            {transaction.date}
                        </DialogDescription>
                        <div className={cn("text-2xl font-bold my-3", getAmountColor())}>
                            {transaction.amount}
                        </div>
                    </DialogHeader>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-4 mt-4"
                    >
                        <Separator />

                        {detailItems.map((item, index) => (
                            <motion.div key={index} variants={itemVariants} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-sm font-medium", item.statusColor || "text-slate-900 dark:text-white")}>{item.value}</span>
                                    {item.copyable && (
                                        <button
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                            onClick={() => navigator.clipboard.writeText(item.value)}
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        <Separator />

                        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Transaction Fee</span>
                                <span className="font-medium text-slate-900 dark:text-white">0.05 RPSC</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Network</span>
                                <span className="font-medium text-slate-900 dark:text-white">RPSC Mainnet</span>
                            </div>
                        </div>
                    </motion.div>

                    <DialogFooter className="flex gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 border-slate-200 dark:border-slate-700"
                        >
                            Close
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            onClick={() => window.open(`/transactions/${transaction.id}`, '_blank')}
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Explorer
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailModal;