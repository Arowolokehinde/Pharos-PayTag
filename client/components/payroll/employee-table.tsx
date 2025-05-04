"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Edit2, X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateAddress } from "@/lib/utils";

interface Employee {
    id: number;
    wallet: string;
    salary: string;
    lastPayoutTime: number;
    active: boolean;
}

interface EmployeeTableProps {
    employees: Employee[];
    loading: boolean;
    contract: ethers.Contract | null;
    onSuccess: () => void;
}

export function EmployeeTable({
    employees,
    loading,
    contract,
    onSuccess,
}: EmployeeTableProps) {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [newSalary, setNewSalary] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogType, setDialogType] = useState<"update" | "deactivate" | null>(null);

    const handleUpdateSalary = async () => {
        if (!selectedEmployee || !newSalary || !contract) return;

        if (parseFloat(newSalary) <= 0) {
            setError("Salary must be greater than 0");
            return;
        }

        setActionLoading(true);
        setError(null);

        try {
            // Convert salary to wei (considering 18 decimals)
            const salaryInWei = ethers.parseEther(newSalary);

            const tx = await contract.updateSalary(selectedEmployee.id, salaryInWei);
            toast.loading("Updating salary...", { id: "update-salary" });

            await tx.wait();

            toast.success("Salary updated successfully!", { id: "update-salary" });
            setNewSalary("");
            onSuccess();
        } catch (error: any) {
            console.error("Error updating salary:", error);
            toast.error(`Failed to update salary: ${error.message || "Unknown error"}`, { id: "update-salary" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeactivateEmployee = async () => {
        if (!selectedEmployee || !contract) return;

        setActionLoading(true);

        try {
            const tx = await contract.deactivateEmployee(selectedEmployee.id);
            toast.loading("Deactivating employee...", { id: "deactivate-employee" });

            await tx.wait();

            toast.success("Employee deactivated successfully!", { id: "deactivate-employee" });
            onSuccess();
        } catch (error: any) {
            console.error("Error deactivating employee:", error);
            toast.error(`Failed to deactivate employee: ${error.message || "Unknown error"}`, { id: "deactivate-employee" });
        } finally {
            setActionLoading(false);
        }
    };

    const openUpdateDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setNewSalary(employee.salary);
        setError(null);
        setDialogType("update");
    };

    const openDeactivateDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setError(null);
        setDialogType("deactivate");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Employee List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                            <p>No employees found.</p>
                            <p className="mt-2 text-sm">
                                Add employees using the "Add Employee" tab.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Wallet</TableHead>
                                        <TableHead>Salary (RSC)</TableHead>
                                        <TableHead>Last Payout</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium">{employee.id}</TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {truncateAddress(employee.wallet)}
                                            </TableCell>
                                            <TableCell>{employee.salary}</TableCell>
                                            <TableCell>
                                                {employee.lastPayoutTime > 0
                                                    ? new Date(employee.lastPayoutTime * 1000).toLocaleDateString()
                                                    : "Never"}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.active
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                    }`}>
                                                    {employee.active ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => openUpdateDialog(employee)}
                                                                disabled={!employee.active}
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Update Employee Salary</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Employee ID</Label>
                                                                        <Input
                                                                            value={selectedEmployee?.id}
                                                                            disabled
                                                                            className="bg-slate-50 dark:bg-slate-800"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Status</Label>
                                                                        <Input
                                                                            value={selectedEmployee?.active ? "Active" : "Inactive"}
                                                                            disabled
                                                                            className="bg-slate-50 dark:bg-slate-800"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Wallet Address</Label>
                                                                    <Input
                                                                        value={selectedEmployee?.wallet}
                                                                        disabled
                                                                        className="bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="new-salary">New Salary (RSC)</Label>
                                                                    <Input
                                                                        id="new-salary"
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="0.00"
                                                                        value={newSalary}
                                                                        onChange={(e) => setNewSalary(e.target.value)}
                                                                        disabled={actionLoading}
                                                                    />
                                                                </div>

                                                                {error && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                                                )}

                                                                <div className="flex justify-end gap-2 pt-2">
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline" disabled={actionLoading}>
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        onClick={handleUpdateSalary}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        {actionLoading ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Updating...
                                                                            </>
                                                                        ) : (
                                                                            "Update Salary"
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950"
                                                                onClick={() => openDeactivateDialog(employee)}
                                                                disabled={!employee.active}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Deactivate Employee</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <p>
                                                                    Are you sure you want to deactivate employee #{selectedEmployee?.id}?
                                                                </p>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    This action cannot be undone. The employee will no longer receive salary payments.
                                                                </p>

                                                                <div className="flex justify-end gap-2 pt-2">
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline" disabled={actionLoading}>
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={handleDeactivateEmployee}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        {actionLoading ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Deactivating...
                                                                            </>
                                                                        ) : (
                                                                            "Deactivate Employee"
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}