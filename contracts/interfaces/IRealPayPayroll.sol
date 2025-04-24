// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRealPayPayroll
 * @dev Interface for the RealPay Payroll contract
 */
interface IRealPayPayroll {
    /**
     * @dev Struct for employee details
     */
    struct Employee {
        string payTag;             // Employee's PayTag
        uint256 salary;            // Salary amount per payment period
        uint256 lastPaymentTime;   // Timestamp of last payment
        uint256 paymentInterval;   // Payment interval in seconds
        bool isActive;             // Whether the employee is active
    }

    /**
     * @dev Event emitted when an employee is added
     */
    event EmployeeAdded(string indexed payTag, uint256 salary);
    
    /**
     * @dev Event emitted when an employee is removed
     */
    event EmployeeRemoved(string indexed payTag);
    
    /**
     * @dev Event emitted when a salary is updated
     */
    event SalaryUpdated(string indexed payTag, uint256 oldSalary, uint256 newSalary);
    
    /**
     * @dev Event emitted when payroll is processed
     */
    event PayrollProcessed(uint256 timestamp, uint256 totalPaid, uint256 employeesPaid);

    /**
     * @dev Adds a new employee to the payroll
     * @param payTag The employee's PayTag (without @ symbol)
     * @param salaryAmount Salary amount per payment period
     * @param paymentInterval Payment interval in seconds (e.g., 2592000 for monthly)
     * @return success Whether the employee was successfully added
     */
    function addEmployee(string calldata payTag, uint256 salaryAmount, uint256 paymentInterval) external returns (bool);
    
    /**
     * @dev Removes an employee from the payroll
     * @param payTag The employee's PayTag to remove
     * @return success Whether the employee was successfully removed
     */
    function removeEmployee(string calldata payTag) external returns (bool);
    
    /**
     * @dev Updates an employee's salary
     * @param payTag The employee's PayTag
     * @param newSalaryAmount The new salary amount
     * @return success Whether the salary was successfully updated
     */
    function updateSalary(string calldata payTag, uint256 newSalaryAmount) external returns (bool);
    
    /**
     * @dev Processes due payments for all eligible employees
     * @return totalPaid The total amount paid
     * @return employeeCount The number of employees paid
     */
    function processPayroll() external returns (uint256 totalPaid, uint256 employeeCount);
    
    /**
     * @dev Pays a specific employee manually
     * @param payTag The employee's PayTag to pay
     * @return success Whether the payment was successful
     */
    function payEmployee(string calldata payTag) external returns (bool);
    
    /**
     * @dev Gets the list of all employees
     * @return The array of employee PayTags
     */
    function getAllEmployees() external view returns (string[] memory);
    
    /**
     * @dev Gets details for a specific employee
     * @param payTag The employee's PayTag
     * @return The Employee struct containing employee details
     */
    function getEmployeeDetails(string calldata payTag) external view returns (Employee memory);
    
    /**
     * @dev Gets the total monthly salary obligation
     * @return The total monthly salary amount
     */
    function getTotalSalaryObligation() external view returns (uint256);
}