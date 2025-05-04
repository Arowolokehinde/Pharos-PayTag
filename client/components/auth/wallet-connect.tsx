"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useWalletContext } from "../providers/wallet-provider";

export default function WalletConnectButton({
    variant = "default",
    className,
}: {
    variant?: "default" | "large" | "mobile";
    className?: string;
}) {
    const { address, isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnecting, setIsConnecting } = useWalletContext();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Format address for display
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Handle connect
    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            connect({ connector: connectors[0] });
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    // Button styles based on variant
    const getButtonStyles = () => {
        switch (variant) {
            case "large":
                return "px-10 py-5 text-base";
            case "mobile":
                return "w-full py-2 text-sm";
            default:
                return "px-4 py-2 text-sm";
        }
    };

    // If connecting, show loading state
    if (isPending || isConnecting) {
        return (
            <button
                disabled
                className={`${getButtonStyles()} min-w-[140px] bg-blue-500 text-white rounded-full flex items-center justify-center ${className}`}
            >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting
            </button>
        );
    }

    // If connected, show connected state
    if (isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
            >
                <button
                    onClick={() => disconnect()}
                    className={`${getButtonStyles()} min-w-[140px] gap-2 border border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-md flex items-center justify-center ${className}`}
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {formatAddress(address!)}
                </button>
            </motion.div>
        );
    }

    // Default state - not connected
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <button
                onClick={handleConnect}
                className={`${getButtonStyles()} min-w-[140px] bg-[#2081cb] rounded-full hover:bg-[#296ea3] text-white flex items-center justify-center ${className}`}
            >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
            </button>
        </motion.div>
    );
}

