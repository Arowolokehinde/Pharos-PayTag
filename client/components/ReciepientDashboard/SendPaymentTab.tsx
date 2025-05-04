import { FC, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Send, ArrowRight, User } from "lucide-react";

interface SendPaymentTabProps {
    walletBalance?: number;
}

const SendPaymentTab: FC<SendPaymentTabProps> = ({ walletBalance }) => {
    const [amount, setAmount] = useState<string>("");
    const [recipientTag, setRecipientTag] = useState<string>("");

    // Calculate the total amount including fees
    const transactionFee = 0.05;
    const totalAmount = amount ? (parseFloat(amount) + transactionFee).toFixed(2) : "0.00";

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Send Payment</h1>
                <p className="text-slate-500 dark:text-slate-400">Transfer RPSC tokens to another PayTag</p>
            </motion.div>

            <Card className="overflow-hidden border-0 shadow-lg relative">
                {/* Decorative gradient border */}
                <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                </div>

                {/* Gradient top border */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10"></div>

                <CardHeader className="relative z-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <Send className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Send RPSC</CardTitle>
                            <CardDescription>Enter recipient and amount details</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipientPayTag" className="text-sm font-medium">Recipient PayTag</Label>
                            <div className="relative">
                                <div className="absolute left-0 bg-gradient-to-r from-blue-600 to-teal-500 w-10 h-full rounded-l-md flex items-center justify-center text-white">
                                    <User className="w-4 h-4" />
                                </div>
                                <Input
                                    id="recipientPayTag"
                                    className="pl-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                    placeholder="Enter recipient's PayTag"
                                    value={recipientTag}
                                    onChange={(e) => setRecipientTag(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-medium">Amount (RPSC)</Label>
                            <div className="relative">
                                <Input
                                    id="amount"
                                    type="text"
                                    placeholder="0.00"
                                    className="pr-16 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                />
                                <div className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-r-md border-l border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">RPSC</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5 pl-1">Available balance: <span className="font-medium text-slate-700 dark:text-slate-300">{walletBalance} RPSC</span></p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-sm font-medium">Note (Optional)</Label>
                            <Textarea
                                id="note"
                                placeholder="Add a note for this transaction"
                                className="resize-none min-h-[80px] border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all relative"
                            />
                        </div>
                    </motion.div>

                    <Separator className="my-6" />

                    <motion.div variants={itemVariants} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Transaction Fee</span>
                            <span className="font-medium text-slate-900 dark:text-white">{transactionFee} RPSC</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Total Amount</span>
                            <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-lg">{totalAmount} RPSC</span>
                        </div>
                    </motion.div>
                </CardContent>

                <CardFooter className="relative z-10 pt-2 pb-6">
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                    >
                        <Button
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <span className="mr-2">Send Payment</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default SendPaymentTab;

