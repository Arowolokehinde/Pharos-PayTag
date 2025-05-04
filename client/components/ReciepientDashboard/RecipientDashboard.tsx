"use client";

import { FC, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Import Lucide icons
import {
    Send,
    Smartphone,
    BarChart3,
    CreditCard,
    ChevronRight
} from "lucide-react";

// Import components
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { TabContent } from "./TabNavigation";
import OverviewTab from "./OverviewTab";
import SendPaymentTab from "./SendPaymentTab";
import AirtimeTab from "./AirtimeTab";
import TransactionsTab from "./TransactionsTab";
import SettingsTab from "./SettingsTab";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/use-web3";
import HelpSupportCenter from "./HelpSupportCenter";
import VerificationKYC from "../EmployerDashboard/VerificationKYC";
import NetworkStatusFeeEstimator from "./NetworkStatusFeeEstimator";

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

const RecipientDashboard: FC = () => {
    // States
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const { address, balance, isConnected } = useWallet();

    // Dummy data
    const payTag = "arowolo";

    // Simulated transactions
    const transactions: Transaction[] = [
        {
            id: "tx-001",
            type: "received",
            title: "Payment Received",
            subtitle: "From: RealTech Ltd",
            amount: "+1,000 RPSC",
            date: "May 3, 2025",
            status: "completed",
            isNew: true
        },
        {
            id: "tx-002",
            type: "airtime",
            title: "Airtime Conversion",
            subtitle: "MTN Nigeria",
            amount: "-100 RPSC",
            date: "May 3, 2025",
            status: "completed"
        },
        {
            id: "tx-003",
            type: "staking",
            title: "Staking Rewards",
            subtitle: "Weekly reward",
            amount: "+25 RPSC",
            date: "Apr 26, 2025",
            status: "completed"
        },
        {
            id: "tx-004",
            type: "sent",
            title: "Payment Sent",
            subtitle: "To: @janedoe",
            amount: "-250 RPSC",
            date: "Apr 20, 2025",
            status: "completed"
        }
    ];

    const upcomingPayments = [
        {
            id: "pay-001",
            from: "RealTech Ltd",
            amount: "1,000 RPSC",
            date: "Jun 3, 2025",
            daysRemaining: 30
        }
    ];

    // Check for mobile view on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // Copy PayTag to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText("@" + text);
        setCopiedToClipboard(true);

        setTimeout(() => {
            setCopiedToClipboard(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                payTag={payTag}
                walletBalance={balance?.decimals}
                isMobile={isMobile}
            />

            {/* Main Content */}
            <div className={cn(
                "min-h-screen transition-all duration-300",
                isSidebarOpen && !isMobile ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Header */}
                <DashboardHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isOpen={isSidebarOpen}
                    payTag={payTag}
                    copiedToClipboard={copiedToClipboard}
                    copyToClipboard={copyToClipboard}
                    isMobile={isMobile}
                    walletBalance={balance?.decimals}
                />

                {/* Main Content Area */}
                <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <TabContent value="overview" activeTab={activeTab}>
                                <OverviewTab
                                    payTag={payTag}
                                    copyToClipboard={copyToClipboard}
                                    copiedToClipboard={copiedToClipboard}
                                    walletAddress={address}
                                    walletBalance={balance?.decimals}
                                    transactions={transactions}
                                    upcomingPayments={upcomingPayments}
                                    setActiveTab={setActiveTab}
                                />
                            </TabContent>
                        )}

                        {activeTab === "send" && (
                            <TabContent value="send" activeTab={activeTab}>
                                <SendPaymentTab walletBalance={balance?.decimals} />
                            </TabContent>
                        )}

                        {activeTab === "airtime" && (
                            <TabContent value="airtime" activeTab={activeTab}>
                                <AirtimeTab walletBalance={balance?.decimals} />
                            </TabContent>
                        )}

                        {activeTab === "transactions" && (
                            <TabContent value="transactions" activeTab={activeTab}>
                                <TransactionsTab transactions={transactions} />
                            </TabContent>
                        )}

                        {activeTab === "settings" && (
                            <TabContent value="settings" activeTab={activeTab}>
                                <SettingsTab payTag={payTag} />
                            </TabContent>
                        )}

                        {activeTab === "help" && (
                            <TabContent value="help" activeTab={activeTab}>
                                <HelpSupportCenter userType="recipient" />
                            </TabContent>
                        )}

                        {activeTab === "verify" && (
                            <TabContent value="verify" activeTab={activeTab}>
                                <VerificationKYC userType="individual" />
                            </TabContent>
                        )}

                        {activeTab === "network" && (
                            <TabContent value="network" activeTab={activeTab}>
                                <NetworkStatusFeeEstimator />
                            </TabContent>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default RecipientDashboard;