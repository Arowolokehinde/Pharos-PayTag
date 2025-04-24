// const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Get initial nonce and balance
  const balance = await deployer.provider.getBalance(deployer.address);
  const currentNonce = await deployer.provider.getTransactionCount(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance));
  console.log("Starting nonce:", currentNonce);

  // Deploy RealStableCoin
  console.log("Deploying RealStableCoin...");
  const RealStableCoin = await hre.ethers.getContractFactory("RealStableCoin");
  const realStableCoin = await RealStableCoin.deploy();
  await realStableCoin.waitForDeployment();
  console.log("RealStableCoin deployed to:", await realStableCoin.getAddress());

  // Deploy RealPayPayroll
  console.log("Deploying RealPayPayroll...");
  const RealPayPayroll = await hre.ethers.getContractFactory("RealPayPayroll");
  const realPayPayroll = await RealPayPayroll.deploy(await realStableCoin.getAddress());
  await realPayPayroll.waitForDeployment();
  console.log("RealPayPayroll deployed to:", await realPayPayroll.getAddress());

  // Deploy PayTagRegistry
  console.log("Deploying PayTagRegistry...");
  const PayTagRegistry = await hre.ethers.getContractFactory("PayTagRegistry");
  const payTagRegistry = await PayTagRegistry.deploy();
  await payTagRegistry.waitForDeployment();
  console.log("PayTagRegistry deployed to:", await payTagRegistry.getAddress());

  // Deploy RWAAssetRegistry
  console.log("Deploying RWAAssetRegistry...");
  const RWAAssetRegistry = await hre.ethers.getContractFactory("RWAAssetRegistry");
  const rwaAssetRegistry = await RWAAssetRegistry.deploy();
  await rwaAssetRegistry.waitForDeployment();
  console.log("RWAAssetRegistry deployed to:", await rwaAssetRegistry.getAddress());

  // Deploy AirtimeConverter
  console.log("Deploying AirtimeConverter...");
  const AirtimeConverter = await hre.ethers.getContractFactory("AirtimeConverter");
  const airtimeConverter = await AirtimeConverter.deploy(await realStableCoin.getAddress());
  await airtimeConverter.waitForDeployment();
  console.log("AirtimeConverter deployed to:", await airtimeConverter.getAddress());

  // Add RealPayPayroll as a minter for RealStableCoin
  console.log("Adding RealPayPayroll as minter...");
  await realStableCoin.addMinter(await realPayPayroll.getAddress());
  console.log("RealPayPayroll added as minter");

  // Add AirtimeConverter as a minter for RealStableCoin
  console.log("Adding AirtimeConverter as minter...");
  await realStableCoin.addMinter(await airtimeConverter.getAddress());
  console.log("AirtimeConverter added as minter");

  console.log("Deployment completed!");
  console.log("Contract addresses:");
  console.log("RealStableCoin:", await realStableCoin.getAddress());
  console.log("RealPayPayroll:", await realPayPayroll.getAddress());
  console.log("PayTagRegistry:", await payTagRegistry.getAddress());
  console.log("RWAAssetRegistry:", await rwaAssetRegistry.getAddress());
  console.log("AirtimeConverter:", await airtimeConverter.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });