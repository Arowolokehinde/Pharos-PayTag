import { FC } from "react";
import { CreditCard, Users, Calendar, Building, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RWAAsset } from "../RWAAssets";

interface DashboardStatsCardsProps {
    walletBalance?: number;
    employeesCount: number;
    nextPayrollDate: string;
    daysToNextPayroll: number;
    rwaAssets: RWAAsset[];
}

export const DashboardStatsCards: FC<DashboardStatsCardsProps> = ({
    walletBalance,
    employeesCount,
    nextPayrollDate,
    daysToNextPayroll,
    rwaAssets
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* RPSC Balance */}
            <Card className="bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">Wallet</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Available Balance</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{walletBalance} RPSC</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">≈ ${walletBalance} USD</p>
                    </div>
                </CardContent>
            </Card>

            {/* Employees */}
            <Card className="bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <Users className="h-5 w-5" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">Team</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Employees</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{employeesCount}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +2 this month
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Next Payroll */}
            <Card className="bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">Payroll</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Next Payroll</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{nextPayrollDate}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">In {daysToNextPayroll} days</p>
                    </div>
                </CardContent>
            </Card>

            {/* RWA Assets */}
            <Card className="bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                            <Building className="h-5 w-5" />
                        </div>
                        <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-medium">Assets</Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Tokenized Assets</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{rwaAssets.length}</p>
                        <p className="text-xs text-teal-600 dark:text-teal-400">475,000 RPSC Total</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};