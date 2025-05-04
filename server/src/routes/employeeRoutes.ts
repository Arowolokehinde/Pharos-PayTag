import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    getEmployeeByWallet,
    createEmployee,
    updateEmployee,
    updateEmployeeSalary,
    deactivateEmployee,
    deleteEmployee,
} from '../controllers/employeeController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Protected routes - for employees to see their own data
router.get('/wallet/:address', protect, getEmployeeByWallet);

// Admin routes
router.get('/', protect, authorize(['admin']), getEmployees);
router.get('/:employeeId', protect, getEmployeeById);
router.post('/', protect, authorize(['admin']), createEmployee);
router.put('/:employeeId', protect, authorize(['admin']), updateEmployee);
router.put('/:employeeId/salary', protect, authorize(['admin']), updateEmployeeSalary);
router.put('/:employeeId/deactivate', protect, authorize(['admin']), deactivateEmployee);
router.delete('/:employeeId', protect, authorize(['admin']), deleteEmployee);

export default router;