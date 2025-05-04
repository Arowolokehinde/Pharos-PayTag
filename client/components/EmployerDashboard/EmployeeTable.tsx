"use client";

import { FC, useState } from "react";
import {
    Search,
    PlusCircle,
    Edit,
    MoreHorizontal,
    FileDown,
    Trash,
    Filter,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Define Employee type
export interface Employee {
    id: string;
    name: string;
    payTag: string;
    salary: string;
    department: string;
    status: "active" | "pending" | "inactive";
    lastPaid: string;
    avatar?: string;
}

interface EmployeeTableProps {
    employees: Employee[];
    onAddEmployee: () => void;
    onEditEmployee: (id: string) => void;
    onDeleteEmployee: (id: string) => void;
}

const EmployeeTable: FC<EmployeeTableProps> = ({
    employees,
    onAddEmployee,
    onEditEmployee,
    onDeleteEmployee
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    // Get unique departments for filter
    const departments = Array.from(new Set(employees.map(emp => emp.department)));

    // Filter employees based on search query and filters
    const filteredEmployees = employees.filter(employee => {
        // Search filter
        const matchesSearch =
            employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.payTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.department.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === "all" || employee.status === statusFilter;

        // Department filter
        const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    // Get status badge styling
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return "bg-gradient-to-r from-green-600 to-emerald-500 text-white";
            case "pending":
                return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
            default:
                return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card className="overflow-hidden border-0 shadow-lg">
                {/* Gradient top border */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>

                <CardHeader className="pb-3 bg-white dark:bg-slate-950">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Employee Directory</CardTitle>
                                <CardDescription>Manage your team members and their payment details</CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={onAddEmployee}
                                className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="bg-white pt-3 dark:bg-slate-900">
                    <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center">
                        <div className="relative flex-1">
                            <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-l-md border-r border-slate-200 dark:border-slate-700">
                                <Search className="h-4 w-4 text-slate-500" />
                            </div>
                            <Input
                                placeholder="Search by name, payTag or department..."
                                className="pl-12 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-slate-500" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-[160px] border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-slate-500" />
                                        <SelectValue placeholder="Department" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <FileDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Department</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">PayTag</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Salary</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Last Paid</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <Avatar className="mr-2 h-8 w-8">
                                                        {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
                                                            {employee.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-slate-900 dark:text-white">{employee.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{employee.department}</td>
                                            <td className="py-3 px-4">
                                                <span className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                                    @{employee.payTag}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{employee.salary}</td>
                                            <td className="py-3 px-4">
                                                <Badge className={cn(
                                                    "rounded-full",
                                                    getStatusBadge(employee.status)
                                                )}>
                                                    {employee.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{employee.lastPaid}</td>
                                            <td className="py-3 px-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => onEditEmployee(employee.id)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.open(`/employee/${employee.payTag}`, '_blank')}>
                                                            <Search className="mr-2 h-4 w-4" /> View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => onDeleteEmployee(employee.id)}
                                                            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                                            No employees found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>

                <CardFooter className="flex items-center bg-white dark:bg-slate-900 justify-between border-t border-slate-200 dark:border-slate-700 px-4 py-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-900 dark:text-white">{filteredEmployees.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{employees.length}</span> employees
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filteredEmployees.length === 0}
                            className="border-slate-200 dark:border-slate-950"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filteredEmployees.length === 0}
                            className="border-slate-200 dark:border-slate-950"
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default EmployeeTable;