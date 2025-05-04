import { FC } from "react";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { PayrollProgressCard } from "./PayrollProgressCard";
import { TeamMembersCard } from "./TeamMembersCard";
import { RWAAssetsCard } from "./RWAAssetsCard";
import { RecentActivitiesCard } from "./RecentActivitiesCard";
import { Employee } from "../EmployeeTable";
import { RWAAsset } from "../RWAAssets";

interface DashboardOverviewProps {
    walletBalance?: number;
    employees: Employee[];
    rwaAssets: RWAAsset[];
    nextPayrollDate: string;
    daysToNextPayroll: number;
    payrollProgress: number;
    recentActivities: {
        id: string;
        title: string;
        description: string;
        time: string;
    }[];
    setActiveTab: (tab: string) => void;
}

export const DashboardOverview: FC<DashboardOverviewProps> = ({
    walletBalance,
    employees,
    rwaAssets,
    nextPayrollDate,
    daysToNextPayroll,
    payrollProgress,
    recentActivities,
    setActiveTab
}) => {
    // Count active employees
    const activeEmployeesCount = employees.filter(e => e.status === "active").length;

    return (
        <>
            {/* Page heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Company Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome to RealPayTag Business Dashboard</p>
            </div>

            {/* Stats Cards */}
            <DashboardStatsCards
                walletBalance={walletBalance}
                employeesCount={employees.length}
                nextPayrollDate={nextPayrollDate}
                daysToNextPayroll={daysToNextPayroll}
                rwaAssets={rwaAssets}
            />

            {/* Payroll Progress */}
            <PayrollProgressCard
                payrollProgress={payrollProgress}
                activeEmployeesCount={activeEmployeesCount}
                nextPayrollDate={nextPayrollDate}
                setActiveTab={setActiveTab}
            />

            {/* Two-column layout for Team and Assets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TeamMembersCard
                    employees={employees}
                    setActiveTab={setActiveTab}
                />
                <RWAAssetsCard
                    rwaAssets={rwaAssets}
                    setActiveTab={setActiveTab}
                />
            </div>

            {/* Recent Activities */}
            <RecentActivitiesCard recentActivities={recentActivities} />
        </>
    );
};