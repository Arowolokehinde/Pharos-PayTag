import { Employee } from "../EmployeeTable";

// Component Interfaces
export interface PayrollProcessingProps {
    employees: Employee[];
    walletBalance?: number;
    nextPayrollDate: string;
    daysToNextPayroll: number;
}

export interface PayrollSummaryCardProps {
    nextPayrollDate: string;
    daysToNextPayroll: number;
    selectedEmployees: string[];
    activeEmployees: Employee[];
    totalPayroll: number;
    walletBalance?: number;
    hasSufficientBalance: boolean;
    selectedPeriod: string;
    setSelectedPeriod: (period: string) => void;
    getPayrollPeriodLabel: () => string;
    selectAll: boolean;
    toggleSelectAll: (value: boolean) => void;
}

export interface EmployeeListProps {
    activeEmployees: Employee[];
    selectedEmployees: string[];
    toggleEmployee: (id: string) => void;
    isProcessing: boolean;
    setConfirmDialogOpen: (open: boolean) => void;
}

export interface PreviousPayrollsProps {
    // Add props if needed
}

export interface ConfirmDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedEmployees: string[];
    totalPayroll: number;
    walletBalance?: number;
    hasSufficientBalance: boolean;
    getPayrollPeriodLabel: () => string;
    processPayroll: () => void;
    isProcessing: boolean;
}

export interface ProcessingDialogProps {
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
    processComplete: boolean;
    processingStep: number;
    selectedEmployees: string[];
}
