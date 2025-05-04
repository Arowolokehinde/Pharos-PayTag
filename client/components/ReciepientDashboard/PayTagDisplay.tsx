"use client";

import { FC } from "react";
import {
    Tag,
    Copy,
    CheckCircle,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PayTagDisplayProps {
    payTag: string;
    copyToClipboard: (text: string) => void;
    copiedToClipboard: boolean;
    variant?: "standard" | "badge" | "large" | "minimal";
    className?: string;
}

const PayTagDisplay: FC<PayTagDisplayProps> = ({
    payTag,
    copyToClipboard,
    copiedToClipboard,
    variant = "standard",
    className
}) => {
    // View on explorer
    const viewOnExplorer = () => {
        window.open(`https://realpaytagexplorer.com/tag/${payTag}`, '_blank');
    };

    // Define component variants
    const getVariantStyles = () => {
        switch (variant) {
            case "badge":
                return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full px-3 py-1 text-xs";

            case "large":
                return "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-base";

            case "minimal":
                return "text-sm font-medium flex items-center";

            case "standard":
            default:
                return "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm";
        }
    };

    return (
        <div className={cn(
            "flex items-center",
            getVariantStyles(),
            className
        )}>
            <div className="flex items-center">
                <Tag className={cn(
                    "text-blue-600 dark:text-blue-400 mr-2",
                    variant === "large" ? "h-5 w-5" : "h-4 w-4"
                )} />
                <span className={cn(
                    variant === "large" ? "font-semibold" : "font-medium"
                )}>
                    @{payTag}
                </span>
            </div>

            <div className="flex items-center ml-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "text-slate-500 hover:text-blue-600 dark:hover:text-blue-400",
                                    variant === "large" ? "h-8 w-8" : "h-7 w-7"
                                )}
                                onClick={() => copyToClipboard(payTag)}
                            >
                                <motion.div
                                    animate={copiedToClipboard ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {copiedToClipboard ?
                                        <CheckCircle className={variant === "large" ? "h-4 w-4" : "h-3.5 w-3.5"} /> :
                                        <Copy className={variant === "large" ? "h-4 w-4" : "h-3.5 w-3.5"} />
                                    }
                                </motion.div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{copiedToClipboard ? "Copied!" : "Copy PayTag"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {variant === "large" && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={viewOnExplorer}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View on Explorer</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {/* Verified badge */}
            {variant === "large" && (
                <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Verified
                </Badge>
            )}
        </div>
    );
};

export default PayTagDisplay;