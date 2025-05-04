"use client";

import { FC } from "react";
import {
    CreditCard,
    AlertCircle,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ConfirmDialogProps } from "./types";



const ConfirmDialog: FC<ConfirmDialogProps> = ({
    open,
    setOpen,
    selectedEmployees,
    totalPayroll,
    walletBalance,
    hasSufficientBalance,
    getPayrollPeriodLabel,
    processPayroll,
    isProcessing
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md border-0 shadow-lg relative">
                <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                </div>

                {/* <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10 -mt-6 -mx-6"></div> */}

                <div className="relative z-10">
                    <DialogHeader className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Confirm Payroll Processing</DialogTitle>
                            <DialogDescription>
                                You are about to process payroll for {selectedEmployees.length} employees with a total amount of {totalPayroll.toLocaleString()} RPSC.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Payroll Summary</h4>
                            <div className="rounded-md border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Period:</span>
                                    <span className="font-medium">{getPayrollPeriodLabel()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Employees:</span>
                                    <span className="font-medium">{selectedEmployees.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Total Amount:</span>
                                    <span className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">{totalPayroll.toLocaleString()} RPSC</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Wallet Balance:</span>
                                    <span className={cn(
                                        "font-medium",
                                        hasSufficientBalance ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {walletBalance} RPSC
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Remaining Balance:</span>
                                    <span className="font-medium">
                                        {walletBalance !== undefined ? (walletBalance - totalPayroll).toLocaleString() : '--'} RPSC
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!hasSufficientBalance && (
                            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400 text-sm flex items-start">
                                <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                    <strong>Insufficient balance.</strong> Please add more RPSC tokens to your wallet before proceeding with payroll.
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="border-slate-200 dark:border-slate-700">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={processPayroll}
                            disabled={!hasSufficientBalance || isProcessing}
                            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                        >
                            Confirm & Process
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;