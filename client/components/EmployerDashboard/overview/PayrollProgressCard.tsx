import { FC } from "react";
import { ArrowUpRight, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PayrollProgressCardProps {
    payrollProgress: number;
    activeEmployeesCount: number;
    nextPayrollDate: string;
    setActiveTab: (tab: string) => void;
}

export const PayrollProgressCard: FC<PayrollProgressCardProps> = ({
    payrollProgress,
    activeEmployeesCount,
    nextPayrollDate,
    setActiveTab
}) => {
    return (
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>

            <CardHeader className="flex flex-row items-start gap-3 bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                    <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Upcoming Payroll</CardTitle>
                        <Button
                            onClick={() => setActiveTab("payroll")}
                            className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            size="sm"
                        >
                            Run Payroll <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>Progress towards next payroll cycle</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-2 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                        Monthly Payroll - May 2025
                    </div>
                    <div className="text-sm font-medium">
                        {payrollProgress}%
                    </div>
                </div>
                <Progress value={payrollProgress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-teal-500" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Total Amount</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">23,400 RPSC</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Employees</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{activeEmployeesCount} active</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Processing Date</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{nextPayrollDate}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};