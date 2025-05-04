"use client";

import { FC } from "react";
import {
    CreditCard,

} from "lucide-react";
import { Button } from "@/components/ui/button";


const PayrollHeader: FC<{
    setConfirmDialogOpen: (open: boolean) => void;
    isProcessing: boolean;
    selectedEmployees: string[];
}> = ({ setConfirmDialogOpen, isProcessing, selectedEmployees }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Payroll</h1>
                <p className="text-slate-500 dark:text-slate-400">Process payments for your team members</p>
            </div>

            <Button
                onClick={() => setConfirmDialogOpen(true)}
                disabled={isProcessing || selectedEmployees.length === 0}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
            >
                <CreditCard className="mr-2 h-4 w-4" /> Run Payroll
            </Button>
        </div>
    );
};

export default PayrollHeader;