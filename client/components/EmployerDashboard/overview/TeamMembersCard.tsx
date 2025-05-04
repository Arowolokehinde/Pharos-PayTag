import { FC } from "react";
import { ArrowUpRight, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Employee } from "../EmployeeTable";

interface TeamMembersCardProps {
    employees: Employee[];
    setActiveTab: (tab: string) => void;
}

export const TeamMembersCard: FC<TeamMembersCardProps> = ({
    employees,
    setActiveTab
}) => {
    return (
        <Card className="overflow-hidden border-0 shadow-md">
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>

            <CardHeader className="flex flex-row items-start gap-3 pb-2 bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                    <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Team Members</CardTitle>
                        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0" onClick={() => setActiveTab("employees")}>
                            View All <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>Your current active employees</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-0 bg-white dark:bg-slate-900">
                <div className="space-y-1">
                    {employees.slice(0, 4).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between py-3 px-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
                                        {employee.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{employee.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        <span className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                            @{employee.payTag}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Badge className={cn(
                                    "rounded-full",
                                    employee.status === "active" ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white" :
                                        employee.status === "pending" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" :
                                            "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                )}>
                                    {employee.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};