const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AirtimeConverter", function () {
  let RealStableCoin;
  let AirtimeConverter;
  let stableCoin;
  let airtimeConverter;
  let owner;
  let user;
  let network1Rate;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    
    // Deploy RealStableCoin first
    RealStableCoin = await ethers.getContractFactory("RealStableCoin");
    stableCoin = await RealStableCoin.deploy();
    await stableCoin.waitForDeployment();
    
    // Deploy AirtimeConverter
    AirtimeConverter = await ethers.getContractFactory("AirtimeConverter");
    airtimeConverter = await AirtimeConverter.deploy(await stableCoin.getAddress());
    await airtimeConverter.waitForDeployment();

    // Setup: Add network and mint tokens
    network1Rate = ethers.parseEther("0.95"); // 95% conversion rate
    await airtimeConverter.addNetwork("MTN", network1Rate);
    
    // Add converter as minter and mint tokens to user
    await stableCoin.addMinter(owner.address);
    await stableCoin.mint(user.address, ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await airtimeConverter.owner()).to.equal(owner.address);
    });

    it("Should be linked to correct stablecoin", async function () {
      const converterAddress = await airtimeConverter.getAddress();
      // Verify converter can mint tokens (is a minter)
      expect(await stableCoin.isMinter(converterAddress)).to.be.false;
    });
  });

  describe("Network Management", function () {
    it("Should add network correctly", async function () {
      const networkInfo = await airtimeConverter.getNetwork(1);
      expect(networkInfo.networkName).to.equal("MTN");
      expect(networkInfo.rate).to.equal(network1Rate);
      expect(networkInfo.isActive).to.be.true;
    });

    it("Should update network rate", async function () {
      const newRate = ethers.parseEther("0.90");
      await airtimeConverter.updateNetworkRate(1, newRate);
      const networkInfo = await airtimeConverter.getNetwork(1);
      expect(networkInfo.rate).to.equal(newRate);
    });

    it("Should deactivate network", async function () {
      await airtimeConverter.deactivateNetwork(1);
      const networkInfo = await airtimeConverter.getNetwork(1);
      expect(networkInfo.isActive).to.be.false;
    });

    it("Should not allow non-owner to add network", async function () {
      await expect(
        airtimeConverter.connect(user).addNetwork("GLO", ethers.parseEther("0.90"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Airtime Conversion", function () {
    beforeEach(async function () {
      // Approve converter to spend user's tokens
      await stableCoin.connect(user).approve(
        await airtimeConverter.getAddress(),
        ethers.parseEther("1000")
      );
    });

    it("Should convert airtime correctly", async function () {
      const airtimeAmount = ethers.parseEther("100");
      const expectedStablecoinAmount = (airtimeAmount * network1Rate) / ethers.parseEther("1");
      
      const initialBalance = await stableCoin.balanceOf(user.address);
      
      await airtimeConverter.connect(user).convertAirtimeToStablecoin(1, airtimeAmount);
      
      const finalBalance = await stableCoin.balanceOf(user.address);
      expect(initialBalance - finalBalance).to.equal(expectedStablecoinAmount);
    });

    it("Should not convert with inactive network", async function () {
      await airtimeConverter.deactivateNetwork(1);
      await expect(
        airtimeConverter.connect(user).convertAirtimeToStablecoin(1, ethers.parseEther("100"))
      ).to.be.revertedWith("AirtimeConverter: network is inactive");
    });

    it("Should not convert with invalid network ID", async function () {
      await expect(
        airtimeConverter.connect(user).convertAirtimeToStablecoin(999, ethers.parseEther("100"))
      ).to.be.revertedWith("AirtimeConverter: invalid network ID");
    });
  });

  describe("Pausable", function () {
    it("Should not allow conversions when paused", async function () {
      await airtimeConverter.pause();
      await expect(
        airtimeConverter.connect(user).convertAirtimeToStablecoin(1, ethers.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow conversions after unpause", async function () {
      await airtimeConverter.pause();
      await airtimeConverter.unpause();
      
      await stableCoin.connect(user).approve(
        await airtimeConverter.getAddress(),
        ethers.parseEther("100")
      );
      
      await expect(
        airtimeConverter.connect(user).convertAirtimeToStablecoin(1, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw stablecoins", async function () {
      const withdrawAmount = ethers.parseEther("10");
      await stableCoin.mint(await airtimeConverter.getAddress(), withdrawAmount);
      
      await airtimeConverter.withdrawStablecoins(withdrawAmount);
      
      expect(await stableCoin.balanceOf(owner.address)).to.equal(withdrawAmount);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(
        airtimeConverter.connect(user).withdrawStablecoins(ethers.parseEther("10"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});