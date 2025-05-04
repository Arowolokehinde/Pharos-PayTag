import { FC, useState } from "react";
import { BarChart3, CreditCard, ChevronRight, Send, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import PayTagDisplay from "./PayTagDisplay";
import BalanceCard from "./BalanceCard";
import TransactionItem from "./TransactionItem";
import TransactionDetailModal from "./TransactionDetailModal";

// Define transaction type for props
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

interface OverviewTabProps {
    payTag: string;
    copyToClipboard: (text: string) => void;
    copiedToClipboard: boolean;
    walletAddress?: string;
    walletBalance?: number;
    transactions: Transaction[];
    upcomingPayments: Array<{
        id: string;
        from: string;
        amount: string;
        date: string;
        daysRemaining: number;
    }>;
    setActiveTab: (tab: string) => void;
}

const OverviewTab: FC<OverviewTabProps> = ({
    payTag,
    copyToClipboard,
    copiedToClipboard,
    walletAddress,
    walletBalance,
    transactions,
    upcomingPayments,
    setActiveTab
}) => {
    // State for transaction detail modal
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle opening the detail modal
    const handleViewDetails = (id: string) => {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            setSelectedTransaction(transaction);
            setIsModalOpen(true);
        }
    };

    // Animation variants for staggered animations
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

    // Actions for quick access
    const quickActions = [
        {
            id: "send-payment",
            label: "Send Payment",
            description: "Transfer RPSC to another PayTag",
            icon: <Send className="w-4 h-4" />,
            gradient: "bg-gradient-to-br from-blue-600 to-teal-500",
            targetTab: "send"
        },
        {
            id: "convert-airtime",
            label: "Convert to Airtime",
            description: "Buy airtime with your RPSC balance",
            icon: <Smartphone className="w-4 h-4" />,
            gradient: "bg-gradient-to-br from-purple-600 to-blue-500",
            targetTab: "airtime"
        },
        {
            id: "view-transactions",
            label: "Transaction History",
            description: "View all your past transactions",
            icon: <BarChart3 className="w-4 h-4" />,
            gradient: "bg-gradient-to-br from-teal-500 to-green-600",
            targetTab: "transactions"
        }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Page heading and PayTag display */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Welcome back!</h1>
                    <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your account</p>
                </div>

                <PayTagDisplay
                    payTag={payTag}
                    copyToClipboard={copyToClipboard}
                    copiedToClipboard={copiedToClipboard}
                    variant="large"
                />
            </motion.div>

            {/* Balance card */}
            <motion.div variants={itemVariants} className="mb-6">
                <BalanceCard
                    balance={walletBalance}
                    walletAddress={walletAddress}
                    onSendClick={() => setActiveTab("send")}
                    onConvertClick={() => setActiveTab("airtime")}
                />
            </motion.div>

            {/* Quick actions section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {quickActions.map((action) => (
                    <Card
                        key={action.id}
                        className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900"
                        onClick={() => setActiveTab(action.targetTab)}
                    >
                        <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
                        <CardContent className="p-5 relative">
                            <div className="space-y-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                                    action.gradient
                                )}>
                                    {action.icon}
                                </div>
                                <div className="group-hover:translate-x-1 transition-transform duration-300">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{action.label}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Recent transactions */}
            <motion.div variants={itemVariants}>
                <Card className="mb-6 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50 dark:bg-slate-950">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your recent payment activity</CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => setActiveTab("transactions")}
                        >
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="px-0 bg-white dark:bg-slate-900">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Upcoming payments */}
            {upcomingPayments.length > 0 && (
                <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden bg-white dark:bg-slate-900">
                        <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
                        <CardHeader>
                            <CardTitle>Upcoming Payments</CardTitle>
                            <CardDescription>Scheduled payments you will receive</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:border-none last:pb-0">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white mr-3">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{payment.from}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Expected on {payment.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900 dark:text-white">{payment.amount}</p>
                                            <p className="text-xs text-green-600 dark:text-green-400">In {payment.daysRemaining} days</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Transaction Detail Modal */}
            <TransactionDetailModal
                transaction={selectedTransaction}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </motion.div>
    );
};

export default OverviewTab;