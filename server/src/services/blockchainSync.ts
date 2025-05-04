import { ethers } from 'ethers';
import { getContracts, provider } from '../config/web3';
import Employee from '../models/Employee';
import logger from '../utils/logger';
import Network from '../models/Network';
import Asset from '../models/Asset';
import Tag from '../models/Tag';

export const syncBlockchainState = async () => {
    try {
        logger.info('Starting blockchain synchronization...');

        const contracts = getContracts();

        // Sync Employees
        await syncEmployees(contracts.realPayPayroll);

        // Sync Tags
        await syncTags(contracts.payTagRegistry);

        // Sync Assets
        await syncAssets(contracts.rwaAssetRegistry);

        // Sync Networks
        await syncNetworks(contracts.airtimeConverter);

        logger.info('Blockchain synchronization completed successfully');
    } catch (error) {
        logger.error('Error synchronizing blockchain state:', error);
        throw error;
    }
};

// Helper function to safely parse event args
function parseEventArgs<T>(event: ethers.Log | ethers.EventLog): T {
    if (!('args' in event)) {
        throw new Error('Event does not contain args');
    }
    return event.args as unknown as T;
}

async function syncEmployees(contract: ethers.Contract) {
    try {
        const events = await contract.queryFilter(
            contract.filters.EmployeeAdded(),
            0,
            'latest'
        );

        for (const event of events) {
            const { employeeId, wallet, salary } = parseEventArgs<{
                employeeId: ethers.BigNumberish;
                wallet: string;
                salary: ethers.BigNumberish;
            }>(event);

            const existingEmployee = await Employee.findOne({ employeeId: Number(employeeId) });

            if (!existingEmployee) {
                const employee = await contract.getEmployee(employeeId);
                const lastPaymentDate = 'lastPaymentDate' in employee ?
                    Number(employee.lastPaymentDate) * 1000 :
                    Date.now();

                await Employee.create({
                    employeeId: Number(employeeId),
                    wallet: wallet.toLowerCase(),
                    salary: ethers.formatEther(salary),
                    lastPayoutTime: lastPaymentDate,
                    active: 'isActive' in employee ? employee.isActive : true,
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing employees:', error);
    }
}

async function syncTags(contract: ethers.Contract) {
    try {
        // const Tag = await import('../models/Tag').then(m => m.default);

        // Handle tag registrations
        const registerEvents = await contract.queryFilter(
            contract.filters.TagRegistered(),
            0,
            'latest'
        );

        for (const event of registerEvents) {
            const { tag, owner } = parseEventArgs<{
                tag: string;
                owner: string;
            }>(event);

            const existingTag = await Tag.findOne({ name: tag });

            if (!existingTag) {
                const address = await contract.resolveTag(tag);
                await Tag.create({
                    name: tag,
                    owner: owner.toLowerCase(),
                    address: address.toLowerCase(),
                });
            }
        }

        // Handle tag transfers
        const transferEvents = await contract.queryFilter(
            contract.filters.TagTransferred(),
            0,
            'latest'
        );

        for (const event of transferEvents) {
            const { tag, newOwner } = parseEventArgs<{
                tag: string;
                newOwner: string;
            }>(event);

            await Tag.findOneAndUpdate(
                { name: tag },
                { owner: newOwner.toLowerCase() }
            );
        }

        // Handle tag updates
        const updateEvents = await contract.queryFilter(
            contract.filters.TagUpdated(),
            0,
            'latest'
        );

        for (const event of updateEvents) {
            const { tag, newAddress } = parseEventArgs<{
                tag: string;
                newAddress: string;
            }>(event);

            await Tag.findOneAndUpdate(
                { name: tag },
                { address: newAddress.toLowerCase() }
            );
        }
    } catch (error) {
        logger.error('Error syncing tags:', error);
    }
}

async function syncAssets(contract: ethers.Contract) {
    try {
        // const Asset = await import('../models/Asset').then(m => m.default);

        // Handle asset registrations
        const registerEvents = await contract.queryFilter(
            contract.filters.AssetRegistered(),
            0,
            'latest'
        );

        for (const event of registerEvents) {
            const { assetId, owner } = parseEventArgs<{
                assetId: ethers.BigNumberish;
                owner: string;
            }>(event);

            const id = Number(assetId);
            const existingAsset = await Asset.findOne({ assetId: id });

            if (!existingAsset) {
                const asset = await contract.getAsset(id);
                await Asset.create({
                    assetId: id,
                    name: asset.name,
                    description: asset.description,
                    location: asset.location,
                    metadata: asset.metadata,
                    category: Number(asset.category),
                    status: Number(asset.status),
                    value: ethers.formatEther(asset.value),
                    owner: asset.owner.toLowerCase(),
                    verified: asset.isVerified,
                    registrationDate: new Date(Number(asset.registrationDate) * 1000),
                    lastUpdateDate: new Date(Number(asset.lastUpdateDate) * 1000),
                });
            }
        }

        // Handle asset verifications
        const verifyEvents = await contract.queryFilter(
            contract.filters.AssetVerified(),
            0,
            'latest'
        );

        for (const event of verifyEvents) {
            const { assetId } = parseEventArgs<{
                assetId: ethers.BigNumberish;
            }>(event);

            await Asset.findOneAndUpdate(
                { assetId: Number(assetId) },
                { verified: true, status: 3 }
            );
        }

        // Handle asset transfers
        const transferEvents = await contract.queryFilter(
            contract.filters.AssetTransferred(),
            0,
            'latest'
        );

        for (const event of transferEvents) {
            const { assetId, to } = parseEventArgs<{
                assetId: ethers.BigNumberish;
                to: string;
            }>(event);

            await Asset.findOneAndUpdate(
                { assetId: Number(assetId) },
                { owner: to.toLowerCase() }
            );
        }
    } catch (error) {
        logger.error('Error syncing assets:', error);
    }
}

async function syncNetworks(contract: ethers.Contract) {
    try {
        // const Network = await import('../models/Network').then(m => m.default);

        // Handle network additions
        const addEvents = await contract.queryFilter(
            contract.filters.NetworkAdded(),
            0,
            'latest'
        );

        for (const event of addEvents) {
            const { networkId, networkName, rate } = parseEventArgs<{
                networkId: ethers.BigNumberish;
                networkName: string;
                rate: ethers.BigNumberish;
            }>(event);

            const id = Number(networkId);
            const existingNetwork = await Network.findOne({ networkId: id });

            if (!existingNetwork) {
                const network = await contract.getNetwork(id);
                await Network.create({
                    networkId: id,
                    name: networkName,
                    rate: ethers.formatUnits(rate, 2),
                    active: network.isActive,
                });
            }
        }

        // Handle network updates
        const updateEvents = await contract.queryFilter(
            contract.filters.NetworkUpdated(),
            0,
            'latest'
        );

        for (const event of updateEvents) {
            const { networkId, newRate } = parseEventArgs<{
                networkId: ethers.BigNumberish;
                newRate: ethers.BigNumberish;
            }>(event);

            await Network.findOneAndUpdate(
                { networkId: Number(networkId) },
                { rate: ethers.formatUnits(newRate, 2) }
            );
        }

        // Handle network deactivations
        const deactivateEvents = await contract.queryFilter(
            contract.filters.NetworkDeactivated(),
            0,
            'latest'
        );

        for (const event of deactivateEvents) {
            const { networkId } = parseEventArgs<{
                networkId: ethers.BigNumberish;
            }>(event);

            await Network.findOneAndUpdate(
                { networkId: Number(networkId) },
                { active: false }
            );
        }
    } catch (error) {
        logger.error('Error syncing networks:', error);
    }
}