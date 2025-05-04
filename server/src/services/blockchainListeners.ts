import { ethers } from 'ethers';
import { getContracts } from '../config/web3';
import Transaction from '../models/Transaction';
import Tag from '../models/Tag';
import Asset from '../models/Asset';
import Employee from '../models/Employee';
import Network from '../models/Network';
import logger from '../utils/logger';
import { ZeroAddress } from 'ethers';

/**
 * Sets up event listeners for all contracts
 */
export const setupBlockchainListeners = () => {
    try {
        const contracts = getContracts();

        // Listen for events from each contract
        setupStableCoinListeners(contracts.realStableCoin);
        setupPayrollListeners(contracts.realPayPayroll);
        setupTagRegistryListeners(contracts.payTagRegistry);
        setupAssetRegistryListeners(contracts.rwaAssetRegistry);
        setupAirtimeConverterListeners(contracts.airtimeConverter);

        logger.info('Blockchain event listeners set up successfully');
    } catch (error) {
        logger.error('Error setting up blockchain event listeners:', error);
    }
};


const setupStableCoinListeners = (contract: ethers.Contract) => {
    // Listen for Transfer events (matches ABI: 'event Transfer(address indexed from, address indexed to, uint256 value)')
    contract.on('Transfer', async (from: string, to: string, value: bigint, event: ethers.EventLog) => {
        try {
            await Transaction.create({
                txHash: event.transactionHash,
                from: from.toLowerCase(),
                to: to.toLowerCase(),
                amount: ethers.formatEther(value), // Changed from 'amount' to 'value' to match ABI
                type: 'transfer',
                status: 'completed',
                blockNumber: event.blockNumber,
                timestamp: new Date(),
            });
            logger.info(`Transfer event recorded: ${event.transactionHash}`);
        } catch (error) {
            logger.error('Error processing Transfer event:', error);
        }
    });

    // Listen for Minted events (matches ABI: 'event Minted(address indexed to, uint256 amount)')
    contract.on('Minted', async (to: string, amount: bigint, event: ethers.EventLog) => {
        try {
            await Transaction.create({
                txHash: event.transactionHash,
                from: ZeroAddress,
                to: to.toLowerCase(),
                amount: ethers.formatEther(amount),
                type: 'minted',
                status: 'completed',
                blockNumber: event.blockNumber,
                timestamp: new Date(),
            });
            logger.info(`Minted event recorded: ${event.transactionHash}`);
        } catch (error) {
            logger.error('Error processing Minted event:', error);
        }
    });

    // Listen for Burned events (matches ABI: 'event Burned(address indexed from, uint256 amount)')
    contract.on('Burned', async (from: string, amount: bigint, event: ethers.EventLog) => {
        try {
            await Transaction.create({
                txHash: event.transactionHash,
                from: from.toLowerCase(),
                to: ZeroAddress,
                amount: ethers.formatEther(amount),
                type: 'burned',
                status: 'completed',
                blockNumber: event.blockNumber,
                timestamp: new Date(),
            });
            logger.info(`Burned event recorded: ${event.transactionHash}`);
        } catch (error) {
            logger.error('Error processing Burned event:', error);
        }
    });

    // Listen for MinterAdded events (matches ABI: 'event MinterAdded(address indexed account)')
    contract.on('MinterAdded', async (account: string, event: ethers.EventLog) => {
        try {
            logger.info(`Minter added: ${account.toLowerCase()}`);
        } catch (error) {
            logger.error('Error processing MinterAdded event:', error);
        }
    });

    // Listen for MinterRemoved events (matches ABI: 'event MinterRemoved(address indexed account)')
    contract.on('MinterRemoved', async (account: string, event: ethers.EventLog) => {
        try {
            logger.info(`Minter removed: ${account.toLowerCase()}`);
        } catch (error) {
            logger.error('Error processing MinterRemoved event:', error);
        }
    });
};

const setupPayrollListeners = (contract: ethers.Contract) => {
    const contractAddress = contract.target.toString();

    // Listen for EmployeeAdded events (matches ABI: 'event EmployeeAdded(uint256 indexed employeeId, address indexed wallet, uint256 salary)')
    contract.on('EmployeeAdded', async (employeeId: bigint, wallet: string, salary: bigint, event: ethers.EventLog) => {
        try {
            await Employee.create({
                employeeId: Number(employeeId),
                wallet: wallet.toLowerCase(),
                salary: ethers.formatEther(salary),
                lastPayoutTime: 0,
                active: true,
            });
            logger.info(`Employee added: ID ${Number(employeeId)}`);
        } catch (error) {
            logger.error('Error processing EmployeeAdded event:', error);
        }
    });

    // Listen for EmployeeUpdated events (matches ABI: 'event EmployeeUpdated(uint256 indexed employeeId, uint256 newSalary)')
    contract.on('EmployeeUpdated', async (employeeId: bigint, newSalary: bigint, event: ethers.EventLog) => {
        try {
            const employee = await Employee.findOne({ employeeId: Number(employeeId) });
            if (employee) {
                employee.salary = ethers.formatEther(newSalary);
                await employee.save();
                logger.info(`Employee salary updated: ID ${Number(employeeId)}`);
            }
        } catch (error) {
            logger.error('Error processing EmployeeUpdated event:', error);
        }
    });

    // Listen for EmployeeDeactivated events (matches ABI: 'event EmployeeDeactivated(uint256 indexed employeeId)')
    contract.on('EmployeeDeactivated', async (employeeId: bigint, event: ethers.EventLog) => {
        try {
            const employee = await Employee.findOne({ employeeId: Number(employeeId) });
            if (employee) {
                employee.active = false;
                await employee.save();
                logger.info(`Employee deactivated: ID ${Number(employeeId)}`);
            }
        } catch (error) {
            logger.error('Error processing EmployeeDeactivated event:', error);
        }
    });

    // Listen for PaymentProcessed events (matches ABI: 'event PaymentProcessed(uint256 indexed employeeId, address indexed wallet, uint256 amount)')
    contract.on('PaymentProcessed', async (employeeId: bigint, wallet: string, amount: bigint, event: ethers.EventLog) => {
        try {
            // Update employee's last payout time (timestamp not in event, using block timestamp)
            const block = await event.getBlock();
            const employee = await Employee.findOne({ employeeId: Number(employeeId) });

            if (employee) {
                employee.lastPayoutTime = block.timestamp;
                await employee.save();

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: contractAddress.toLowerCase(),
                    to: wallet.toLowerCase(),
                    amount: ethers.formatEther(amount),
                    type: 'payroll',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date(block.timestamp * 1000), // Convert block timestamp to Date
                    metadata: { employeeId: Number(employeeId) },
                });
                logger.info(`Payment processed for employee ID ${Number(employeeId)}`);
            }
        } catch (error) {
            logger.error('Error processing PaymentProcessed event:', error);
        }
    });
};

/**
 * Set up listeners for PayTagRegistry events
 */
const setupTagRegistryListeners = (contract: ethers.Contract) => {
    const contractAddress = contract.target.toString();

    // Listen for TagRegistered events
    contract.on('TagRegistered', async (tag: string, wallet: string, owner: string, event: ethers.EventLog) => {
        try {
            // Create tag record
            await Tag.create({
                name: tag,
                owner: owner.toLowerCase(),
                address: wallet.toLowerCase(),
            });

            // Create transaction record
            await Transaction.create({
                txHash: event.transactionHash,
                from: owner.toLowerCase(),
                to: contractAddress.toLowerCase(),
                amount: '0',
                type: 'tagRegistration',
                status: 'completed',
                blockNumber: event.blockNumber,
                timestamp: new Date(),
                metadata: { tag },
            });

            logger.info(`Tag registered: ${tag}`);
        } catch (error) {
            logger.error('Error processing TagRegistered event:', error);
        }
    });

    // Listen for TagUpdated events
    contract.on('TagUpdated', async (tag: string, newWallet: string, event: ethers.EventLog) => {
        try {
            // Update tag record
            const tagRecord = await Tag.findOne({ name: tag });

            if (tagRecord) {
                tagRecord.address = newWallet.toLowerCase();
                await tagRecord.save();
                logger.info(`Tag updated: ${tag}`);
            }
        } catch (error) {
            logger.error('Error processing TagUpdated event:', error);
        }
    });

    // Listen for TagTransferred events
    contract.on('TagTransferred', async (tag: string, newOwner: string, event: ethers.EventLog) => {
        try {
            // Update tag record
            const tagRecord = await Tag.findOne({ name: tag });

            if (tagRecord) {
                tagRecord.owner = newOwner.toLowerCase();
                await tagRecord.save();
                logger.info(`Tag transferred: ${tag}`);
            }
        } catch (error) {
            logger.error('Error processing TagTransferred event:', error);
        }
    });
};

/**
 * Set up listeners for RWAAssetRegistry events
 */
const setupAssetRegistryListeners = (contract: ethers.Contract) => {
    const contractAddress = contract.target.toString();

    // Listen for AssetRegistered events
    contract.on('AssetRegistered', async (assetId: bigint, name: string, value: bigint, owner: string, event: ethers.EventLog) => {
        try {
            // Create asset record
            await Asset.create({
                assetId: Number(assetId),
                name,
                value: ethers.formatEther(value),
                owner: owner.toLowerCase(),
                verified: false,
            });

            // Create transaction record
            await Transaction.create({
                txHash: event.transactionHash,
                from: owner.toLowerCase(),
                to: contractAddress.toLowerCase(),
                amount: ethers.formatEther(value),
                type: 'assetRegistration',
                status: 'completed',
                blockNumber: event.blockNumber,
                timestamp: new Date(),
                metadata: { assetId: Number(assetId), name },
            });

            logger.info(`Asset registered: ID ${Number(assetId)}, Name: ${name}`);
        } catch (error) {
            logger.error('Error processing AssetRegistered event:', error);
        }
    });

    // Listen for AssetUpdated events
    contract.on('AssetUpdated', async (assetId: bigint, name: string, value: bigint, event: ethers.EventLog) => {
        try {
            // Update asset record
            const asset = await Asset.findOne({ assetId: Number(assetId) });

            if (asset) {
                asset.name = name;
                asset.value = ethers.formatEther(value);
                await asset.save();
                logger.info(`Asset updated: ID ${Number(assetId)}`);
            }
        } catch (error) {
            logger.error('Error processing AssetUpdated event:', error);
        }
    });

    // Listen for AssetVerified events
    contract.on('AssetVerified', async (assetId: bigint, event: ethers.EventLog) => {
        try {
            // Update asset record
            const asset = await Asset.findOne({ assetId: Number(assetId) });

            if (asset) {
                asset.verified = true;
                await asset.save();
                logger.info(`Asset verified: ID ${Number(assetId)}`);
            }
        } catch (error) {
            logger.error('Error processing AssetVerified event:', error);
        }
    });
};

/**
 * Set up listeners for AirtimeConverter events
 */
const setupAirtimeConverterListeners = (contract: ethers.Contract) => {
    const contractAddress = contract.target.toString();

    // Listen for NetworkAdded events
    contract.on('NetworkAdded', async (networkId: bigint, networkName: string, rate: bigint, event: ethers.EventLog) => {
        try {
            // Create network record
            await Network.create({
                networkId: Number(networkId),
                name: networkName,
                rate: ethers.formatUnits(rate, 2), // Assuming 2 decimals for rates
                active: true,
            });

            logger.info(`Network added: ID ${Number(networkId)}, Name: ${networkName}`);
        } catch (error) {
            logger.error('Error processing NetworkAdded event:', error);
        }
    });

    // Listen for NetworkUpdated events
    contract.on('NetworkUpdated', async (networkId: bigint, rate: bigint, event: ethers.EventLog) => {
        try {
            // Update network record
            const network = await Network.findOne({ networkId: Number(networkId) });

            if (network) {
                network.rate = ethers.formatUnits(rate, 2);
                await network.save();
                logger.info(`Network updated: ID ${Number(networkId)}`);
            }
        } catch (error) {
            logger.error('Error processing NetworkUpdated event:', error);
        }
    });

    // Listen for NetworkDeactivated events
    contract.on('NetworkDeactivated', async (networkId: bigint, event: ethers.EventLog) => {
        try {
            // Update network record
            const network = await Network.findOne({ networkId: Number(networkId) });

            if (network) {
                network.active = false;
                await network.save();
                logger.info(`Network deactivated: ID ${Number(networkId)}`);
            }
        } catch (error) {
            logger.error('Error processing NetworkDeactivated event:', error);
        }
    });

    // Listen for AirtimeConverted events
    contract.on('AirtimeConverted', async (networkId: bigint, user: string, airtimeAmount: bigint, stablecoinAmount: bigint, event: ethers.EventLog) => {
        try {
            // Create transaction record
            await Transaction.create({
                txHash: event.transactionHash,
                from: user.toLowerCase(),
                to: contractAddress.toLowerCase(),
                amount: ethers.formatEther(stablecoinAmount),
                type: 'airtimeConversion',
                status: 'completed',
                blockNumber: event.blockNumber,
                timestamp: new Date(),
                metadata: {
                    networkId: Number(networkId),
                    airtimeAmount: ethers.formatEther(airtimeAmount),
                },
            });

            logger.info(`Airtime converted: User ${user.toLowerCase()}, Network ID ${Number(networkId)}`);
        } catch (error) {
            logger.error('Error processing AirtimeConverted event:', error);
        }
    });
};

// Start the blockchain listeners when this module is imported
setupBlockchainListeners();