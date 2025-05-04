import { PayrollSummaryCardProps } from "./types";
"use client";

import { FC, useState, useEffect } from "react";
import {
    Calendar,
    CreditCard,
    Users,
    CheckCircle,
    AlertCircle,
    Clock,
    Loader2,
    FileText,
    CalendarClock,
    Wallet,
    RefreshCw,
    Download,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";

const PayrollSummaryCard: FC<PayrollSummaryCardProps> = ({
    nextPayrollDate,
    daysToNextPayroll,
    selectedEmployees,
    activeEmployees,
    totalPayroll,
    hasSufficientBalance,
    selectedPeriod,
    setSelectedPeriod,
    getPayrollPeriodLabel,
    selectAll,
    toggleSelectAll
}) => {
    return (
        <Card className="overflow-hidden border-0 shadow-md ">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
            <CardHeader className="flex flex-row items-start gap-3 bg-white dark:bg-slate-950">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                    <DollarSign className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle>Payroll Summary</CardTitle>
                    <CardDescription>Overview of upcoming payroll</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-start">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center mr-3">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Next Payroll</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{nextPayrollDate}</div>
                            <div className="text-xs text-amber-600 dark:text-amber-400">In {daysToNextPayroll} days</div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-start">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center mr-3">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Active Employees</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {selectedEmployees.length} of {activeEmployees.length}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Selected for payroll
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-start">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center mr-3">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Total Amount</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {totalPayroll.toLocaleString()} RPSC
                            </div>
                            <div className={cn(
                                "text-xs",
                                hasSufficientBalance ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            )}>
                                {hasSufficientBalance ? "Sufficient balance" : "Insufficient balance"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 md:items-end">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="payroll-period">Payroll Period</Label>
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger id="payroll-period" className="border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all">
                                    <SelectValue placeholder="Select period type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 flex-1">
                            <Label htmlFor="period-label">Period</Label>
                            <div id="period-label" className="border border-slate-200 dark:border-slate-700 rounded-md h-10 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800">
                                {getPayrollPeriodLabel()}
                            </div>
                        </div>

                        <div className="flex-1 md:flex-none">
                            <Button variant="outline" className="w-full md:w-auto border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <CalendarClock className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="select-all" className="font-medium">Select All Employees</Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Choose which employees to include in this payroll run
                            </p>
                        </div>
                        <Switch
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={toggleSelectAll}
                            className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PayrollSummaryCard;