"use client";

import { FC } from "react";
import {
    ArrowRight,
    Send,
    Smartphone,
    BarChart3,
    ExternalLink,
    Check,
    Clock,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Define transaction type
export interface Transaction {
    id: string;
    type: "received" | "sent" | "airtime" | "staking";
    title: string;
    subtitle: string;
    amount: string;
    date: string;
    status: "completed" | "pending" | "failed";
    isNew?: boolean;
}

interface TransactionItemProps {
    transaction: Transaction;
    onViewDetails?: (id: string) => void;
    compact?: boolean;
}

const TransactionItem: FC<TransactionItemProps> = ({
    transaction,
    onViewDetails,
    compact = false
}) => {
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

    // Get status badge
    const getStatusBadge = () => {
        switch (transaction.status) {
            case "completed":
                return (
                    <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Completed
                    </Badge>
                );
            case "pending":
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending
                    </Badge>
                );
            case "failed":
                return (
                    <Badge variant="outline" className="text-red-600 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Failed
                    </Badge>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className={cn(
                "flex items-center justify-between py-3 px-6 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 group",
                transaction.isNew ? "bg-blue-50 dark:bg-blue-900/20" : "",
                compact ? "py-2.5 px-4" : ""
            )}
            onClick={() => onViewDetails && onViewDetails(transaction.id)}
        >
            <div className="flex items-center">
                <div className={cn(
                    "flex-shrink-0 rounded-full flex items-center justify-center shadow-sm",
                    getTypeColor(),
                    compact ? "w-8 h-8 mr-2" : "w-10 h-10 mr-3"
                )}>
                    {getIcon()}
                </div>
                <div>
                    <p className={cn(
                        "font-medium text-slate-900 dark:text-white",
                        compact ? "text-sm" : ""
                    )}>
                        {transaction.title}
                        {transaction.isNew && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-2 py-0.5 text-xs font-medium text-white">
                                New
                            </span>
                        )}
                    </p>
                    <p className={cn(
                        "text-slate-500 dark:text-slate-400",
                        compact ? "text-xs" : "text-sm"
                    )}>
                        {transaction.subtitle}
                    </p>
                </div>
            </div>

            <div className="text-right">
                <p className={cn(
                    "font-medium",
                    transaction.amount.startsWith("+") ? "bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent" :
                        transaction.amount.startsWith("-") ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white",
                    compact ? "text-sm" : ""
                )}>
                    {transaction.amount}
                </p>
                <p className={cn(
                    "text-slate-500 dark:text-slate-400",
                    compact ? "text-xs" : "text-sm"
                )}>
                    {transaction.date}
                </p>

                {!compact && transaction.status !== "completed" && (
                    <div className="mt-1">
                        {getStatusBadge()}
                    </div>
                )}
            </div>

            {!compact && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-full ml-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="sr-only">View details</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </motion.div>
    );
};

export default TransactionItem;