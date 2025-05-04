const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RealPayPayroll", function () {
  let RealStableCoin;
  let RealPayPayroll;
  let stableCoin;
  let payroll;
  let owner;
  let employee1;
  let employee2;

  const MONTH = 30 * 24 * 60 * 60; // 30 days in seconds

  beforeEach(async function () {
    [owner, employee1, employee2] = await ethers.getSigners();
    
    // Deploy RealStableCoin
    RealStableCoin = await ethers.getContractFactory("RealStableCoin");
    stableCoin = await RealStableCoin.deploy();
    await stableCoin.waitForDeployment();
    
    // Deploy RealPayPayroll
    RealPayPayroll = await ethers.getContractFactory("RealPayPayroll");
    payroll = await RealPayPayroll.deploy(await stableCoin.getAddress());
    await payroll.waitForDeployment();

    // Setup: Add payroll as minter and mint initial tokens
    await stableCoin.addMinter(owner.address);
    await stableCoin.mint(await payroll.getAddress(), ethers.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await payroll.owner()).to.equal(owner.address);
    });

    it("Should be linked to correct stablecoin", async function () {
      const payrollAddress = await payroll.getAddress();
      expect(await stableCoin.balanceOf(payrollAddress)).to.equal(ethers.parseEther("10000"));
    });
  });

  describe("Employee Management", function () {
    const monthlySalary = ethers.parseEther("1000");

    it("Should add employee correctly", async function () {
      await expect(payroll.addEmployee(employee1.address, monthlySalary))
        .to.emit(payroll, "EmployeeAdded")
        .withArgs(1, employee1.address, monthlySalary);

      const employeeInfo = await payroll.getEmployee(1);
      expect(employeeInfo.wallet).to.equal(employee1.address);
      expect(employeeInfo.salary).to.equal(monthlySalary);
      expect(employeeInfo.isActive).to.be.true;
    });

    it("Should not add employee with zero salary", async function () {
      await expect(payroll.addEmployee(employee1.address, 0))
        .to.be.revertedWith("RealPayPayroll: salary must be greater than 0");
    });

    it("Should not add employee with zero address", async function () {
      await expect(payroll.addEmployee(ethers.ZeroAddress, monthlySalary))
        .to.be.revertedWith("RealPayPayroll: invalid wallet address");
    });

    it("Should not allow non-owner to add employee", async function () {
      await expect(payroll.connect(employee1).addEmployee(employee2.address, monthlySalary))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Salary Updates", function () {
    const initialSalary = ethers.parseEther("1000");
    const newSalary = ethers.parseEther("1500");

    beforeEach(async function () {
      await payroll.addEmployee(employee1.address, initialSalary);
    });

    it("Should update employee salary", async function () {
      await expect(payroll.updateEmployeeSalary(1, newSalary))
        .to.emit(payroll, "EmployeeUpdated")
        .withArgs(1, newSalary);

      const employeeInfo = await payroll.getEmployee(1);
      expect(employeeInfo.salary).to.equal(newSalary);
    });

    it("Should not update non-existent employee", async function () {
      await expect(payroll.updateEmployeeSalary(999, newSalary))
        .to.be.revertedWith("RealPayPayroll: invalid employee ID");
    });

    it("Should not update to zero salary", async function () {
      await expect(payroll.updateEmployeeSalary(1, 0))
        .to.be.revertedWith("RealPayPayroll: salary must be greater than 0");
    });
  });

  describe("Employee Deactivation", function () {
    beforeEach(async function () {
      await payroll.addEmployee(employee1.address, ethers.parseEther("1000"));
    });

    it("Should deactivate employee", async function () {
      await expect(payroll.deactivateEmployee(1))
        .to.emit(payroll, "EmployeeDeactivated")
        .withArgs(1);

      const employeeInfo = await payroll.getEmployee(1);
      expect(employeeInfo.isActive).to.be.false;
    });

    it("Should not deactivate non-existent employee", async function () {
      await expect(payroll.deactivateEmployee(999))
        .to.be.revertedWith("RealPayPayroll: invalid employee ID");
    });

    it("Should not deactivate already inactive employee", async function () {
      await payroll.deactivateEmployee(1);
      await expect(payroll.deactivateEmployee(1))
        .to.be.revertedWith("RealPayPayroll: employee is already inactive");
    });
  });

  describe("Payroll Processing", function () {
    const salary = ethers.parseEther("1000");

    beforeEach(async function () {
      await payroll.addEmployee(employee1.address, salary);
    });

    it("Should process payroll after 30 days", async function () {
      // Advance time by 30 days
      await time.increase(MONTH);

      await expect(payroll.processPayroll(1))
        .to.emit(payroll, "PaymentProcessed")
        .withArgs(1, employee1.address, salary);

      expect(await stableCoin.balanceOf(employee1.address)).to.equal(salary);
    });

    it("Should not process payroll before 30 days", async function () {
      // Advance time by 29 days
      await time.increase(MONTH - 86400);

      await expect(payroll.processPayroll(1))
        .to.be.revertedWith("RealPayPayroll: payment too soon");
    });

    it("Should not process payroll for inactive employee", async function () {
      await payroll.deactivateEmployee(1);
      await time.increase(MONTH);

      await expect(payroll.processPayroll(1))
        .to.be.revertedWith("RealPayPayroll: employee is not active");
    });
  });

  describe("Employee Queries", function () {
    beforeEach(async function () {
      await payroll.addEmployee(employee1.address, ethers.parseEther("1000"));
    });

    it("Should get employee by ID", async function () {
      const employeeInfo = await payroll.getEmployee(1);
      expect(employeeInfo.wallet).to.equal(employee1.address);
      expect(employeeInfo.salary).to.equal(ethers.parseEther("1000"));
      expect(employeeInfo.isActive).to.be.true;
    });

    it("Should get employee ID by wallet", async function () {
      const employeeId = await payroll.getEmployeeIdByWallet(employee1.address);
      expect(employeeId).to.equal(1);
    });
  });

  describe("Pausable", function () {
    const salary = ethers.parseEther("1000");

    beforeEach(async function () {
      // Add employee
      await payroll.addEmployee(employee1.address, salary);
      
      // Setup stablecoin
      await stableCoin.addMinter(owner.address);
      await stableCoin.mint(await payroll.getAddress(), ethers.parseEther("10000"));
      
      // Advance time to make payment eligible
      await time.increase(MONTH);
    });

    it("Should not process payroll when paused", async function () {
      // Verify initial state
      const initialBalance = await stableCoin.balanceOf(employee1.address);
      expect(initialBalance).to.equal(0);

      // Pause the contract
      await payroll.pause();
      
      // Verify contract is paused
      expect(await payroll.paused()).to.be.true;

      // Try to process payroll while paused
      await expect(
        payroll.processPayroll(1)
      ).to.be.revertedWith("Pausable: paused");

      // Verify no payment was made
      const finalBalance = await stableCoin.balanceOf(employee1.address);
      expect(finalBalance).to.equal(0);
    });

    it("Should process payroll after unpause", async function () {
      await payroll.pause();
      await payroll.unpause();
      
      // Process payroll
      await payroll.processPayroll(1);
      
      // Verify payment was made
      const balance = await stableCoin.balanceOf(employee1.address);
      expect(balance).to.equal(salary);
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        payroll.connect(employee1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
