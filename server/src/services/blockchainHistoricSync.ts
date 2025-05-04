import { ethers } from 'ethers';
import { getContracts, provider } from '../config/web3';
import Transaction from '../models/Transaction';
import logger from '../utils/logger';

export const syncHistoricEvents = async () => {
    try {
        logger.info('Starting historic event synchronization...');

        const contracts = getContracts();

        // Get the latest block number in the database
        const latestTx = await Transaction.findOne().sort({ blockNumber: -1 });
        const fromBlock = latestTx?.blockNumber ? latestTx.blockNumber + 1 : 0;

        // Sync StableCoin events
        await syncStableCoinEvents(contracts.realStableCoin, fromBlock);
        await syncPayrollEvents(contracts.realPayPayroll, fromBlock);
        await syncPayTagEvents(contracts.payTagRegistry, fromBlock);
        await syncAssetEvents(contracts.rwaAssetRegistry, fromBlock);
        await syncAirtimeEvents(contracts.airtimeConverter, fromBlock);
        await syncLockEvents(contracts.lock, fromBlock);

        logger.info('Historic event synchronization completed');
    } catch (error) {
        logger.error('Error synchronizing historic events:', error);
        throw error;
    }
};


async function syncStableCoinEvents(contract: ethers.Contract, fromBlock: number) {
    try {
        // Get all Transfer events
        const transferEvents = await contract.queryFilter(
            contract.filters.Transfer(),
            fromBlock,
            'latest'
        );

        // Process each event
        for (const event of transferEvents) {
            // Type guard to ensure we have an EventLog with args
            if (!('args' in event)) {
                logger.warn(`Event without args found in transaction ${event.transactionHash}`);
                continue;
            }

            // Safe access to event args with proper typing
            const args = event.args as unknown as {
                from: string;
                to: string;
                value: ethers.BigNumberish;
            };

            // Destructure with type safety
            const { from, to, value } = args;

            // Check if transaction already exists
            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                // Get block timestamp safely
                const block = await provider.getBlock(event.blockNumber);
                if (!block) {
                    logger.warn(`Block ${event.blockNumber} not found`);
                    continue;
                }

                // Create transaction record
                await Transaction.create({
                    txHash: event.transactionHash,
                    from: from.toLowerCase(),
                    to: to.toLowerCase(),
                    amount: ethers.formatEther(value),
                    type: 'transfer',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date(block.timestamp * 1000),
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing StableCoin events:', error);
    }
}

function parseEventArgs<T>(event: ethers.Log | ethers.EventLog): T {
    if (!('args' in event)) {
        throw new Error('Event does not contain args');
    }
    return event.args as unknown as T;
}

async function syncPayrollEvents(contract: ethers.Contract, fromBlock: number) {
    try {
        // Sync EmployeeAdded events
        const employeeAddedEvents = await contract.queryFilter(
            contract.filters.EmployeeAdded(),
            fromBlock,
            'latest'
        );

        for (const event of employeeAddedEvents) {
            const { employeeId, wallet, salary } = parseEventArgs<{
                employeeId: ethers.BigNumberish;
                wallet: string;
                salary: ethers.BigNumberish;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const tx = await event.getTransaction();
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: tx.from.toLowerCase(),
                    to: contract.target.toString().toLowerCase(),
                    amount: ethers.formatEther(salary),
                    type: 'employeeRegistration',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: { employeeId: employeeId.toString() }
                });
            }
        }

        // Sync PaymentProcessed events
        const paymentEvents = await contract.queryFilter(
            contract.filters.PaymentProcessed(),
            fromBlock,
            'latest'
        );

        for (const event of paymentEvents) {
            const { employeeId, wallet, amount } = parseEventArgs<{
                employeeId: ethers.BigNumberish;
                wallet: string;
                amount: ethers.BigNumberish;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: contract.target.toString().toLowerCase(),
                    to: wallet.toLowerCase(),
                    amount: ethers.formatEther(amount),
                    type: 'payroll',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: { employeeId: employeeId.toString() }
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing Payroll events:', error);
    }
}

async function syncPayTagEvents(contract: ethers.Contract, fromBlock: number) {
    try {
        // Sync TagRegistered events
        const tagRegisteredEvents = await contract.queryFilter(
            contract.filters.TagRegistered(),
            fromBlock,
            'latest'
        );

        for (const event of tagRegisteredEvents) {
            const { tag, owner } = parseEventArgs<{
                tag: string;
                owner: string;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: owner.toLowerCase(),
                    to: contract.target.toString().toLowerCase(),
                    amount: '0',
                    type: 'tagRegistration',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: { tag }
                });
            }
        }

        // Sync TagTransferred events
        const tagTransferredEvents = await contract.queryFilter(
            contract.filters.TagTransferred(),
            fromBlock,
            'latest'
        );

        for (const event of tagTransferredEvents) {
            const { tag, oldOwner, newOwner } = parseEventArgs<{
                tag: string;
                oldOwner: string;
                newOwner: string;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: oldOwner.toLowerCase(),
                    to: newOwner.toLowerCase(),
                    amount: '0',
                    type: 'tagTransfer',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: { tag }
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing PayTag events:', error);
    }
}

async function syncAssetEvents(contract: ethers.Contract, fromBlock: number) {
    try {
        // Sync AssetRegistered events
        const assetRegisteredEvents = await contract.queryFilter(
            contract.filters.AssetRegistered(),
            fromBlock,
            'latest'
        );

        for (const event of assetRegisteredEvents) {
            const { assetId, owner, category } = parseEventArgs<{
                assetId: ethers.BigNumberish;
                owner: string;
                category: ethers.BigNumberish;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: owner.toLowerCase(),
                    to: contract.target.toString().toLowerCase(),
                    amount: '0',
                    type: 'assetRegistration',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: {
                        assetId: assetId.toString(),
                        category: category.toString()
                    }
                });
            }
        }

        // Sync AssetVerified events
        const assetVerifiedEvents = await contract.queryFilter(
            contract.filters.AssetVerified(),
            fromBlock,
            'latest'
        );

        for (const event of assetVerifiedEvents) {
            const { assetId, verifier } = parseEventArgs<{
                assetId: ethers.BigNumberish;
                verifier: string;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: verifier.toLowerCase(),
                    to: contract.target.toString().toLowerCase(),
                    amount: '0',
                    type: 'assetVerification',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: { assetId: assetId.toString() }
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing Asset events:', error);
    }
}

async function syncAirtimeEvents(contract: ethers.Contract, fromBlock: number) {
    try {
        // Sync NetworkAdded events
        const networkAddedEvents = await contract.queryFilter(
            contract.filters.NetworkAdded(),
            fromBlock,
            'latest'
        );

        for (const event of networkAddedEvents) {
            const { networkId, networkName, rate } = parseEventArgs<{
                networkId: ethers.BigNumberish;
                networkName: string;
                rate: ethers.BigNumberish;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const tx = await event.getTransaction();
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: tx.from.toLowerCase(),
                    to: contract.target.toString().toLowerCase(),
                    amount: '0',
                    type: 'networkAdded',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: {
                        networkId: networkId.toString(),
                        networkName
                    }
                });
            }
        }

        // Sync AirtimeConverted events
        const airtimeConvertedEvents = await contract.queryFilter(
            contract.filters.AirtimeConverted(),
            fromBlock,
            'latest'
        );

        for (const event of airtimeConvertedEvents) {
            const { networkId, user, airtimeAmount, stablecoinAmount } = parseEventArgs<{
                networkId: ethers.BigNumberish;
                user: string;
                airtimeAmount: ethers.BigNumberish;
                stablecoinAmount: ethers.BigNumberish;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: user.toLowerCase(),
                    to: contract.target.toString().toLowerCase(),
                    amount: ethers.formatEther(stablecoinAmount),
                    type: 'airtimeConversion',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date((block?.timestamp || 0) * 1000),
                    metadata: {
                        networkId: networkId.toString(),
                        airtimeAmount: ethers.formatEther(airtimeAmount)
                    }
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing Airtime events:', error);
    }
}

async function syncLockEvents(contract: ethers.Contract, fromBlock: number) {
    try {
        // Sync Withdrawal events
        const withdrawalEvents = await contract.queryFilter(
            contract.filters.Withdrawal(),
            fromBlock,
            'latest'
        );

        for (const event of withdrawalEvents) {
            const { amount, when } = parseEventArgs<{
                amount: ethers.BigNumberish;
                when: ethers.BigNumberish;
            }>(event);

            const existingTx = await Transaction.findOne({ txHash: event.transactionHash });

            if (!existingTx) {
                const owner = await contract.owner();
                const block = await provider.getBlock(event.blockNumber);

                await Transaction.create({
                    txHash: event.transactionHash,
                    from: contract.target.toString().toLowerCase(),
                    to: owner.toLowerCase(),
                    amount: ethers.formatEther(amount),
                    type: 'lockWithdrawal',
                    status: 'completed',
                    blockNumber: event.blockNumber,
                    timestamp: new Date(Number(when) * 1000),
                    metadata: { unlockTime: when.toString() }
                });
            }
        }
    } catch (error) {
        logger.error('Error syncing Lock events:', error);
    }
}