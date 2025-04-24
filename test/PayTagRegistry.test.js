const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PayTagRegistry", function () {
  let PayTagRegistry;
  let registry;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    PayTagRegistry = await ethers.getContractFactory("PayTagRegistry");
    registry = await PayTagRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });
  });

  describe("Tag Registration", function () {
    it("Should allow registering a valid tag", async function () {
      await expect(registry.connect(user1).registerTag("validtag"))
        .to.emit(registry, "TagRegistered")
        .withArgs("validtag", user1.address);

      expect(await registry.resolveTag("validtag")).to.equal(user1.address);
    });

    it("Should not allow registering a tag that's too short", async function () {
      await expect(registry.connect(user1).registerTag("ab"))
        .to.be.revertedWith("PayTagRegistry: Tag too short");
    });

    it("Should not allow registering a tag that's too long", async function () {
      await expect(registry.connect(user1).registerTag("thistagiswaytoolongtobevalid123"))
        .to.be.revertedWith("PayTagRegistry: Tag too long");
    });

    it("Should not allow registering an already taken tag", async function () {
      await registry.connect(user1).registerTag("takenTag");
      await expect(registry.connect(user2).registerTag("takenTag"))
        .to.be.revertedWith("PayTagRegistry: Tag already registered");
    });

    it("Should only allow alphanumeric characters and underscore", async function () {
      await expect(registry.connect(user1).registerTag("valid_tag123")).to.not.be.reverted;
      await expect(registry.connect(user1).registerTag("invalid-tag!"))
        .to.be.revertedWith("PayTagRegistry: Invalid character in tag");
    });
  });

  describe("Tag Resolution", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerTag("user1tag");
    });

    it("Should correctly resolve registered tags", async function () {
      expect(await registry.resolveTag("user1tag")).to.equal(user1.address);
    });

    it("Should fail to resolve unregistered tags", async function () {
      await expect(registry.resolveTag("nonexistent"))
        .to.be.revertedWith("PayTagRegistry: Tag not registered");
    });
  });

  describe("Tag Updates", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerTag("updatetag");
    });

    it("Should allow owner to update tag address", async function () {
      await expect(registry.connect(user1).updateTag("updatetag", user2.address))
        .to.emit(registry, "TagUpdated")
        .withArgs("updatetag", user1.address, user2.address);

      expect(await registry.resolveTag("updatetag")).to.equal(user2.address);
    });

    it("Should not allow non-owner to update tag", async function () {
      await expect(registry.connect(user2).updateTag("updatetag", user2.address))
        .to.be.revertedWith("PayTagRegistry: Not tag owner");
    });

    it("Should not allow updating to zero address", async function () {
      await expect(registry.connect(user1).updateTag("updatetag", ethers.ZeroAddress))
        .to.be.revertedWith("PayTagRegistry: Invalid address");
    });
  });

  describe("Tag Transfer", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerTag("transfertag");
    });

    it("Should allow owner to transfer tag ownership", async function () {
      await expect(registry.connect(user1).transferTag("transfertag", user2.address))
        .to.emit(registry, "TagTransferred")
        .withArgs("transfertag", user1.address, user2.address);

      expect(await registry.getTagOwner("transfertag")).to.equal(user2.address);
      expect(await registry.resolveTag("transfertag")).to.equal(user2.address);
    });

    it("Should not allow non-owner to transfer tag", async function () {
      await expect(registry.connect(user2).transferTag("transfertag", user2.address))
        .to.be.revertedWith("PayTagRegistry: Not tag owner");
    });

    it("Should not allow transfer to zero address", async function () {
      await expect(registry.connect(user1).transferTag("transfertag", ethers.ZeroAddress))
        .to.be.revertedWith("PayTagRegistry: Invalid address");
    });
  });

  describe("Tag Queries", function () {
    beforeEach(async function () {
      await registry.connect(user1).registerTag("tag1");
      await registry.connect(user1).registerTag("tag2");
      await registry.connect(user2).registerTag("tag3");
    });

    it("Should correctly return tags by owner", async function () {
      const user1Tags = await registry.getTagsByOwner(user1.address);
      const tags = [...user1Tags].sort();
      expect(tags.length).to.equal(2);
      expect(tags[0]).to.equal("tag1");
      expect(tags[1]).to.equal("tag2");
    });

    it("Should correctly return all tags", async function () {
      const allTags = await registry.getAllTags();
      const tags = [...allTags].sort();
      expect(tags.length).to.equal(3);
      expect(tags[0]).to.equal("tag1");
      expect(tags[1]).to.equal("tag2");
      expect(tags[2]).to.equal("tag3");
    });

    it("Should correctly check tag availability", async function () {
      expect(await registry.isTagAvailable("tag1")).to.be.false;
      expect(await registry.isTagAvailable("availabletag")).to.be.true;
    });

    it("Should correctly return tag owner", async function () {
      expect(await registry.getTagOwner("tag1")).to.equal(user1.address);
      expect(await registry.getTagOwner("tag3")).to.equal(user2.address);
    });
  });
});
