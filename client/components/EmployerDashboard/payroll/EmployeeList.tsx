"use client";

import { FC } from "react";
import {
    CreditCard,
    Users,

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

import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmployeeListProps } from "./types";


const EmployeeList: FC<EmployeeListProps> = ({
    activeEmployees,
    selectedEmployees,
    toggleEmployee,
    isProcessing,
    setConfirmDialogOpen
}) => {
    return (
        <Card className="overflow-hidden border-0 shadow-md">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
            <CardHeader className="flex flex-row items-start gap-3 bg-white dark:bg-slate-950 ">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                    <Users className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>Team members to be paid in this cycle</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <span className="sr-only">Select</span>
                                </TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>PayTag</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead className="text-right">Salary (RPSC)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeEmployees.length > 0 ? (
                                activeEmployees.map((employee) => {
                                    const isSelected = selectedEmployees.includes(employee.id);
                                    return (
                                        <TableRow key={employee.id} className={cn(
                                            "bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors",
                                            !isSelected ? "opacity-50" : ""
                                        )}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Switch
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleEmployee(employee.id)}
                                                        aria-label={`Select ${employee.name}`}
                                                        className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
                                                            {employee.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">{employee.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                                    @{employee.payTag}
                                                </span>
                                            </TableCell>
                                            <TableCell>{employee.department}</TableCell>
                                            <TableCell className="text-right font-medium">{employee.salary}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center bg-white dark:bg-slate-900">
                                        No active employees found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedEmployees.length} of {activeEmployees.length} employees selected for payroll
                </div>

                <Button
                    onClick={() => setConfirmDialogOpen(true)}
                    disabled={isProcessing || selectedEmployees.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                >
                    <CreditCard className="mr-2 h-4 w-4" /> Process Payroll
                </Button>
            </CardFooter>
        </Card>
    );
};

export default EmployeeList;
