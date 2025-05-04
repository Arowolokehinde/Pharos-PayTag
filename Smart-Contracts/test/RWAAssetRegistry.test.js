const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RWAAssetRegistry", function () {
  let RWAAssetRegistry;
  let registry;
  let owner;
  let user1;
  let user2;
  let verifier;

  beforeEach(async function () {
    [owner, user1, user2, verifier] = await ethers.getSigners();
    RWAAssetRegistry = await ethers.getContractFactory("RWAAssetRegistry");
    registry = await RWAAssetRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });
  });

  describe("Asset Registration", function () {
    const validAsset = {
      name: "Luxury Apartment",
      description: "2BHK Luxury Apartment in Downtown",
      location: "123 Main St, Downtown",
      metadata: "IPFS://metadata",
      category: 0, // REAL_ESTATE
      value: ethers.parseEther("500000")
    };

    it("Should register a valid asset", async function () {
      await expect(registry.connect(user1).registerAsset(
        validAsset.name,
        validAsset.description,
        validAsset.location,
        validAsset.metadata,
        validAsset.category,
        validAsset.value
      )).to.emit(registry, "AssetRegistered")
        .withArgs(1, user1.address, validAsset.category);
    });

    it("Should not register asset with empty name", async function () {
      await expect(registry.connect(user1).registerAsset(
        "",
        validAsset.description,
        validAsset.location,
        validAsset.metadata,
        validAsset.category,
        validAsset.value
      )).to.be.revertedWith("RWAAssetRegistry: name cannot be empty");
    });

    it("Should not register asset with zero value", async function () {
      await expect(registry.connect(user1).registerAsset(
        validAsset.name,
        validAsset.description,
        validAsset.location,
        validAsset.metadata,
        validAsset.category,
        0
      )).to.be.revertedWith("RWAAssetRegistry: value must be greater than 0");
    });
  });

  describe("Asset Updates", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerAsset(
        "Initial Asset",
        "Description",
        "Location",
        "Metadata",
        0,
        ethers.parseEther("100")
      );
    });

    it("Should allow owner to update asset", async function () {
      await expect(registry.connect(user1).updateAsset(
        1,
        "Updated Asset",
        "New Description",
        "New Location",
        "New Metadata",
        ethers.parseEther("200")
      )).to.emit(registry, "AssetUpdated")
        .withArgs(1, user1.address);

      const asset = await registry.getAsset(1);
      expect(asset.name).to.equal("Updated Asset");
      expect(asset.value).to.equal(ethers.parseEther("200"));
    });

    it("Should not allow non-owner to update asset", async function () {
      await expect(registry.connect(user2).updateAsset(
        1,
        "Updated Asset",
        "New Description",
        "New Location",
        "New Metadata",
        ethers.parseEther("200")
      )).to.be.revertedWith("RWAAssetRegistry: not the asset owner");
    });
  });

  describe("Asset Transfer", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerAsset(
        "Transfer Asset",
        "Description",
        "Location",
        "Metadata",
        0,
        ethers.parseEther("100")
      );
    });

    it("Should allow owner to transfer asset", async function () {
      await expect(registry.connect(user1).transferAsset(1, user2.address))
        .to.emit(registry, "AssetTransferred")
        .withArgs(1, user1.address, user2.address);

      const asset = await registry.getAsset(1);
      expect(asset.owner).to.equal(user2.address);
    });

    it("Should not allow non-owner to transfer asset", async function () {
      await expect(registry.connect(user2).transferAsset(1, user2.address))
        .to.be.revertedWith("RWAAssetRegistry: not the asset owner");
    });
  });

  describe("Asset Verification", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerAsset(
        "Verify Asset",
        "Description",
        "Location",
        "Metadata",
        0,
        ethers.parseEther("100")
      );
    });

    it("Should allow owner to verify asset", async function () {
      await expect(registry.verifyAsset(1))
        .to.emit(registry, "AssetVerified")
        .withArgs(1, owner.address);

      const asset = await registry.getAsset(1);
      expect(asset.isVerified).to.be.true;
      expect(asset.status).to.equal(3); // VERIFIED
    });

    it("Should not allow non-owner to verify asset", async function () {
      await expect(
        registry.connect(user1).verifyAsset(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Asset Queries", function () {
    beforeEach(async function () {
      // Register multiple assets
      await registry.connect(user1).registerAsset(
        "Asset 1",
        "Description 1",
        "Location 1",
        "Metadata 1",
        0,
        ethers.parseEther("100")
      );
      await registry.connect(user1).registerAsset(
        "Asset 2",
        "Description 2",
        "Location 2",
        "Metadata 2",
        1,
        ethers.parseEther("200")
      );
    });

    it("Should correctly return asset by ID", async function () {
      const asset = await registry.getAsset(1);
      expect(asset.name).to.equal("Asset 1");
      expect(asset.owner).to.equal(user1.address);
    });

    it("Should correctly return assets by owner", async function () {
      const assets = await registry.getAssetsByOwner(user1.address);
      expect(assets.length).to.equal(2);
      expect(assets[0]).to.equal(1n);
      expect(assets[1]).to.equal(2n);
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      await registry.pause();
      await expect(registry.connect(user1).registerAsset(
        "Paused Asset",
        "Description",
        "Location",
        "Metadata",
        0,
        ethers.parseEther("100")
      )).to.be.revertedWith("Pausable: paused");

      await registry.unpause();
      await expect(registry.connect(user1).registerAsset(
        "Unpaused Asset",
        "Description",
        "Location",
        "Metadata",
        0,
        ethers.parseEther("100")
      )).to.not.be.reverted;
    });
  });
});
