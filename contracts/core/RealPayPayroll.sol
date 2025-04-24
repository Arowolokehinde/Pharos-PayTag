// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./RealStableCoin.sol";

/**
 * @title RealPayPayroll
 * @dev Handles payroll functionality with scheduled payments
 */
contract RealPayPayroll is Ownable, Pausable, ReentrancyGuard {
    // Reference to the RealStableCoin contract
    RealStableCoin private _stableCoin;
    
    // Struct to store employee information
    struct Employee {
        address wallet;
        uint256 salary;
        uint256 lastPaymentDate;
        bool isActive;
    }
    
    // Mapping from employee ID to Employee struct
    mapping(uint256 => Employee) private _employees;
    
    // Mapping from wallet address to employee ID
    mapping(address => uint256) private _walletToEmployeeId;
    
    // Counter for employee IDs
    uint256 private _employeeCounter;
    
    // Events
    event EmployeeAdded(uint256 indexed employeeId, address indexed wallet, uint256 salary);
    event EmployeeUpdated(uint256 indexed employeeId, uint256 newSalary);
    event EmployeeDeactivated(uint256 indexed employeeId);
    event PaymentProcessed(uint256 indexed employeeId, address indexed wallet, uint256 amount);
    
    constructor(address stableCoinAddress) {
        require(stableCoinAddress != address(0), "RealPayPayroll: invalid stablecoin address");
        _stableCoin = RealStableCoin(stableCoinAddress);
    }
    
    /**
     * @dev Add a new employee
     * @param wallet The employee's wallet address
     * @param salary The employee's salary in stablecoin
     */
    function addEmployee(address wallet, uint256 salary) external onlyOwner {
        require(wallet != address(0), "RealPayPayroll: invalid wallet address");
        require(salary > 0, "RealPayPayroll: salary must be greater than 0");
        require(_walletToEmployeeId[wallet] == 0, "RealPayPayroll: employee already exists");
        
        _employeeCounter++;
        _employees[_employeeCounter] = Employee({
            wallet: wallet,
            salary: salary,
            lastPaymentDate: block.timestamp,
            isActive: true
        });
        
        _walletToEmployeeId[wallet] = _employeeCounter;
        
        emit EmployeeAdded(_employeeCounter, wallet, salary);
    }
    
    /**
     * @dev Update an employee's salary
     * @param employeeId The ID of the employee
     * @param newSalary The new salary amount
     */
    function updateEmployeeSalary(uint256 employeeId, uint256 newSalary) external onlyOwner {
        require(employeeId > 0 && employeeId <= _employeeCounter, "RealPayPayroll: invalid employee ID");
        require(newSalary > 0, "RealPayPayroll: salary must be greater than 0");
        require(_employees[employeeId].isActive, "RealPayPayroll: employee is not active");
        
        _employees[employeeId].salary = newSalary;
        
        emit EmployeeUpdated(employeeId, newSalary);
    }
    
    /**
     * @dev Deactivate an employee
     * @param employeeId The ID of the employee
     */
    function deactivateEmployee(uint256 employeeId) external onlyOwner {
        require(employeeId > 0 && employeeId <= _employeeCounter, "RealPayPayroll: invalid employee ID");
        require(_employees[employeeId].isActive, "RealPayPayroll: employee is already inactive");
        
        _employees[employeeId].isActive = false;
        _walletToEmployeeId[_employees[employeeId].wallet] = 0;
        
        emit EmployeeDeactivated(employeeId);
    }
    
    /**
     * @dev Process payroll for an employee
     * @param employeeId The ID of the employee
     */
    function processPayroll(uint256 employeeId) external whenNotPaused nonReentrant {
        require(employeeId > 0 && employeeId <= _employeeCounter, "RealPayPayroll: invalid employee ID");
        
        Employee storage employee = _employees[employeeId];
        require(employee.isActive, "RealPayPayroll: employee is not active");
        
        // Calculate time since last payment (in seconds)
        uint256 timeSinceLastPayment = block.timestamp - employee.lastPaymentDate;
        require(timeSinceLastPayment >= 30 days, "RealPayPayroll: payment too soon");
        
        // Calculate payment amount
        uint256 paymentAmount = employee.salary;
        
        // Update last payment date
        employee.lastPaymentDate = block.timestamp;
        
        // Transfer payment
        require(_stableCoin.transfer(employee.wallet, paymentAmount), "RealPayPayroll: transfer failed");
        
        emit PaymentProcessed(employeeId, employee.wallet, paymentAmount);
    }
    
    /**
     * @dev Get employee information
     * @param employeeId The ID of the employee
     * @return wallet The employee's wallet address
     * @return salary The employee's salary
     * @return lastPaymentDate The last payment timestamp
     * @return isActive Whether the employee is active
     */
    function getEmployee(uint256 employeeId) external view returns (
        address wallet,
        uint256 salary,
        uint256 lastPaymentDate,
        bool isActive
    ) {
        require(employeeId > 0 && employeeId <= _employeeCounter, "RealPayPayroll: invalid employee ID");
        
        Employee storage employee = _employees[employeeId];
        return (
            employee.wallet,
            employee.salary,
            employee.lastPaymentDate,
            employee.isActive
        );
    }
    
    /**
     * @dev Get employee ID by wallet address
     * @param wallet The wallet address
     * @return The employee ID
     */
    function getEmployeeIdByWallet(address wallet) external view returns (uint256) {
        return _walletToEmployeeId[wallet];
    }
    
    /**
     * @dev Pause all payroll operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause all payroll operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
