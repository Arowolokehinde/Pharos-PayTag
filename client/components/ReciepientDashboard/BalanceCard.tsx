"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
    Send,
    Smartphone,
    Copy,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

interface BalanceCardProps {
    balance?: number;
    walletAddress: any;
    onSendClick: () => void;
    onConvertClick: () => void;
}

const BalanceCard: FC<BalanceCardProps> = ({
    balance,
    walletAddress,
    onSendClick,
    onConvertClick
}) => {
    // Copy wallet address to clipboard
    const copyWalletAddress = () => {
        navigator.clipboard.writeText(walletAddress);
    };

    return (
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 z-0"></div>

            {/* Mesh pattern overlay for added depth */}
            <div
                className="absolute inset-0 mix-blend-soft-light z-0"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 45%), 
                            radial-gradient(circle at 80% 70%, rgba(50, 200, 200, 0.2) 0%, transparent 40%)`
                }}
            ></div>

            {/* Animated wave pattern */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <svg className="absolute w-full h-full" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,149.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        fill="#ffffff"
                        fillOpacity="0.1"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,176C672,203,768,245,864,261.3C960,277,1056,267,1152,234.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        fill="#ffffff"
                        fillOpacity="0.1"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Card Content */}
            <div className="relative p-6 md:p-8 z-10 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Balance Information */}
                    <div className="space-y-2">
                        <p className="text-sm text-white/90">Available Balance</p>
                        <h2 className="text-3xl md:text-4xl font-bold">{balance} RPSC</h2>
                        <p className="text-sm text-white/80">≈ ${balance} USD</p>
                    </div>

                    {/* Wallet Address (hidden on mobile) */}
                    <div className="hidden md:block">
                        <div className="flex flex-col items-end">
                            <p className="text-sm text-white/80 mb-1">Wallet Address</p>
                            <div className="flex items-center bg-white/10 rounded-lg px-3 py-1">
                                <p className="text-sm font-mono">
                                    {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
                                </p>
                                <div className="flex items-center ml-2 space-x-1">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                                                    onClick={copyWalletAddress}
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Copy Address</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                                                    onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View on Etherscan</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={onSendClick}
                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-md border-0 rounded-xl py-5 px-6"
                            size="lg"
                        >
                            <Send className="mr-2 h-4 w-4" /> Send Payment
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={onConvertClick}
                            className="bg-white/20 hover:bg-white/30 shadow-md border-0 rounded-xl py-5 px-6 text-white"
                            size="lg"
                        >
                            <Smartphone className="mr-2 h-4 w-4" /> Convert to Airtime
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;