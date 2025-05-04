import { Request, Response, NextFunction } from 'express';
import Employee from '../models/Employee';
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { ethers } from 'ethers';
import { getContracts } from '../config/web3';
import Transaction from '../models/Transaction';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Filtering
        const filter: Record<string, any> = {};

        // Filter by active status
        if (req.query.active === 'true') {
            filter.active = true;
        } else if (req.query.active === 'false') {
            filter.active = false;
        }

        const employees = await Employee.find(filter).sort({ employeeId: 1 });

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    }
);

// @desc    Get employee by ID
// @route   GET /api/employees/:employeeId
// @access  Private
export const getEmployeeById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({ employeeId: parseInt(employeeId) });

        if (!employee) {
            return next(new ErrorResponse('Employee not found', 404));
        }

        // Check if the requester is admin or the employee itself
        if (
            req.user?.role !== 'admin' &&
            employee.wallet.toLowerCase() !== req.user?.address.toLowerCase()
        ) {
            return next(new ErrorResponse('Not authorized to access this resource', 403));
        }

        res.status(200).json({
            success: true,
            data: employee,
        });
    }
);

// @desc    Get employee by wallet address
// @route   GET /api/employees/wallet/:address
// @access  Private
export const getEmployeeByWallet = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.params;

        if (!ethers.isAddress(address)) {
            return next(new ErrorResponse('Invalid address', 400));
        }

        const employee = await Employee.findOne({ wallet: address.toLowerCase() });

        if (!employee) {
            return next(new ErrorResponse('Employee not found', 404));
        }

        // Check if the requester is admin or the employee itself
        if (
            req.user?.role !== 'admin' &&
            employee.wallet.toLowerCase() !== req.user?.address.toLowerCase()
        ) {
            return next(new ErrorResponse('Not authorized to access this resource', 403));
        }

        res.status(200).json({
            success: true,
            data: employee,
        });
    }
);

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
// src/controllers/employeeController.ts

export const createEmployee = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { wallet, salary } = req.body;

        // Validate required fields
        if (!wallet || !salary) {
            return next(new ErrorResponse('Please provide all required fields', 400));
        }

        // Validate wallet address
        if (!ethers.isAddress(wallet)) {
            return next(new ErrorResponse('Invalid wallet address', 400));
        }

        try {
            // Format salary to match contract expectations (in wei)
            const salaryInWei = ethers.parseEther(salary.toString());

            // Create employee record in DB first
            const employeeId = await getNextEmployeeId();

            const employee = await Employee.create({
                employeeId,
                wallet: wallet.toLowerCase(),
                salary: salary,
                lastPayoutTime: 0,
                active: true,
            });

            // Then add to blockchain
            const contracts = getContracts();
            const tx = await contracts.realPayPayroll.addEmployee(
                wallet,
                salaryInWei
            );

            // Track the transaction
            await Transaction.create({
                txHash: tx.hash,
                from: req.user?.address || tx.from,
                to: contracts.realPayPayroll.address,
                amount: "0",
                type: "employeeRegistration",
                status: "pending",
                timestamp: new Date(),
                metadata: {
                    employeeId: employee.employeeId,
                    wallet: employee.wallet,
                    salary: employee.salary
                },
            });

            res.status(201).json({
                success: true,
                data: employee,
                transaction: tx.hash,
            });
        } catch (error: any) {
            console.error("Error adding employee:", error);
            return next(new ErrorResponse(`Failed to add employee: ${error.message || "Unknown error"}`, 500));
        }
    }
);

// Helper function to get next employee ID
async function getNextEmployeeId(): Promise<number> {
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
    return (lastEmployee?.employeeId || 0) + 1;
}

// @desc    Update employee
// @route   PUT /api/employees/:employeeId
// @access  Private/Admin
export const updateEmployee = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params;
        const { wallet, salary, lastPayoutTime, active } = req.body;

        const employee = await Employee.findOne({ employeeId: parseInt(employeeId) });

        if (!employee) {
            return next(new ErrorResponse('Employee not found', 404));
        }

        // Update fields
        if (wallet && ethers.isAddress(wallet)) {
            employee.wallet = wallet.toLowerCase();
        }
        if (salary) employee.salary = salary;
        if (lastPayoutTime !== undefined) employee.lastPayoutTime = lastPayoutTime;
        if (active !== undefined) employee.active = active;

        await employee.save();

        res.status(200).json({
            success: true,
            data: employee,
        });
    }
);

// @desc    Update employee salary
// @route   PUT /api/employees/:employeeId/salary
// @access  Private/Admin
export const updateEmployeeSalary = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params;
        const { salary } = req.body;

        if (!salary) {
            return next(new ErrorResponse('Please provide salary', 400));
        }

        const employee = await Employee.findOne({ employeeId: parseInt(employeeId) });

        if (!employee) {
            return next(new ErrorResponse('Employee not found', 404));
        }

        // Update salary
        employee.salary = salary;
        await employee.save();

        res.status(200).json({
            success: true,
            data: employee,
        });
    }
);

// src/controllers/employeeController.ts (continued)
export const deactivateEmployee = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({ employeeId: parseInt(employeeId) });

        if (!employee) {
            return next(new ErrorResponse('Employee not found', 404));
        }

        // Deactivate employee
        employee.active = false;
        await employee.save();

        res.status(200).json({
            success: true,
            data: employee,
        });
    }
);

// @desc    Delete employee
// @route   DELETE /api/employees/:employeeId
// @access  Private/Admin
export const deleteEmployee = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params;

        const employee = await Employee.findOneAndDelete({
            employeeId: parseInt(employeeId),
        });

        if (!employee) {
            return next(new ErrorResponse('Employee not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    }
);