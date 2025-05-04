const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealStableCoin", function () {
  let RealStableCoin;
  let stableCoin;
  let owner;
  let minter;
  let user;

  beforeEach(async function () {
    [owner, minter, user] = await ethers.getSigners();
    RealStableCoin = await ethers.getContractFactory("RealStableCoin");
    stableCoin = await RealStableCoin.deploy();
    await stableCoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await stableCoin.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await stableCoin.name()).to.equal("Real Stable Coin");
      expect(await stableCoin.symbol()).to.equal("RSC");
    });

    it("Should start with zero total supply", async function () {
      expect(await stableCoin.totalSupply()).to.equal(0);
    });
  });

  describe("Minter Management", function () {
    it("Should allow owner to add minter", async function () {
      await stableCoin.addMinter(minter.address);
      expect(await stableCoin.isMinter(minter.address)).to.be.true;
    });

    it("Should allow owner to remove minter", async function () {
      await stableCoin.addMinter(minter.address);
      await stableCoin.removeMinter(minter.address);
      expect(await stableCoin.isMinter(minter.address)).to.be.false;
    });

    it("Should not allow non-owner to add minter", async function () {
      await expect(
        stableCoin.connect(minter).addMinter(user.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await stableCoin.addMinter(minter.address);
    });

    it("Should allow minter to mint tokens", async function () {
      const amount = ethers.parseEther("100");
      await stableCoin.connect(minter).mint(user.address, amount);
      expect(await stableCoin.balanceOf(user.address)).to.equal(amount);
    });

    it("Should not allow non-minter to mint tokens", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        stableCoin.connect(user).mint(user.address, amount)
      ).to.be.revertedWith("RealStableCoin: caller is not a minter");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await stableCoin.addMinter(minter.address);
      await stableCoin.connect(minter).mint(user.address, ethers.parseEther("100"));
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("50");
      await stableCoin.connect(user).burn(burnAmount);
      expect(await stableCoin.balanceOf(user.address)).to.equal(ethers.parseEther("50"));
    });
  });

  describe("Pausable", function () {
    beforeEach(async function () {
      // Setup initial state
      await stableCoin.addMinter(minter.address);
      await stableCoin.connect(minter).mint(user.address, ethers.parseEther("100"));
    });

    it("Should allow owner to pause and unpause", async function () {
      await stableCoin.pause();
      await expect(
        stableCoin.connect(user).transfer(minter.address, ethers.parseEther("10"))
      ).to.be.revertedWith("Pausable: paused");

      await stableCoin.unpause();
      await expect(
        stableCoin.connect(user).transfer(minter.address, ethers.parseEther("10"))
      ).to.not.be.reverted;
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        stableCoin.connect(user).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
}); 
