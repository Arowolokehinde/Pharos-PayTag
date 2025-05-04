import { FC, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Filter, Download, BarChart3, CalendarDays } from "lucide-react";
import TransactionItem from "./TransactionItem";
import TransactionDetailModal from "./TransactionDetailModal";
import { Transaction } from "./OverviewTab";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface TransactionsTabProps {
    transactions: Transaction[];
}

const TransactionsTab: FC<TransactionsTabProps> = ({ transactions }) => {
    const [transactionType, setTransactionType] = useState("all");
    const [timePeriod, setTimePeriod] = useState("recent");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle opening the detail modal
    const handleViewDetails = (id: string) => {
        const transaction = [...transactions, ...transactions].find(
            (t, index) => `${t.id}-${index}` === id
        );

        if (transaction) {
            setSelectedTransaction({
                ...transaction,
                id: id // Use the modified ID that includes the index
            });
            setIsModalOpen(true);
        }
    };

    // Animation variants
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
        <motion.div
            initial="hidden relative"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Transaction History</h1>
                <p className="text-slate-500 dark:text-slate-400">View all your past transactions</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden border-0 shadow-lg relative">
                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                        <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                    </div>

                    {/* Gradient top border */}
                    <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10"></div>

                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>All Transactions</CardTitle>
                                <CardDescription>Your complete payment history</CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search transactions"
                                    className="pl-10 h-9 w-[200px] border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                />
                            </div>

                            <Select value={transactionType} onValueChange={setTransactionType}>
                                <SelectTrigger className="w-[140px] h-9 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="airtime">Airtime</SelectItem>
                                    <SelectItem value="staking">Staking</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={timePeriod} onValueChange={setTimePeriod}>
                                <SelectTrigger className="w-[140px] h-9 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all">
                                    <SelectValue placeholder="Time Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Recent</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-1 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                            >
                                <CalendarDays className="h-4 w-4 text-slate-500" />
                                <span>Date Range</span>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                            >
                                <Download className="h-4 w-4 mr-1" />
                                Export
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="px-0 relative z-10">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.concat(transactions).map((transaction, index) => (
                                <TransactionItem
                                    key={`${transaction.id}-${index}`}
                                    transaction={{ ...transaction, id: `${transaction.id}-${index}`, isNew: index < 1 && transaction.isNew }}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between relative z-10">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>

                        <div className="text-sm flex items-center gap-1">
                            <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">1</span>
                            <span className="text-slate-500 dark:text-slate-400">of 1</span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Transaction Detail Modal */}
            <TransactionDetailModal
                transaction={selectedTransaction}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </motion.div>
    );
};

export default TransactionsTab;