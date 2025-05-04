// import { ethers } from 'ethers';
// import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from './contracts';
// import logger from '../utils/logger';
// import dotenv from "dotenv"

// dotenv.config()

// // Configure provider with network settings
// const providerOptions = {
//     chainId: process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : undefined,
//     name: process.env.NETWORK_NAME || "custom",
//     ensAddress: undefined
// };


// const provider = new ethers.JsonRpcProvider(
//     process.env.PHAROS_DEVNET_URL,
//     providerOptions,
// );


// // Initialize contracts
// const getContracts = () => {
//     try {
//         return {
//             realStableCoin: new ethers.Contract(
//                 CONTRACT_ADDRESSES.realStableCoin,
//                 CONTRACT_ABIS.realStableCoin,
//                 provider
//             ),
//             realPayPayroll: new ethers.Contract(
//                 CONTRACT_ADDRESSES.realPayPayroll,
//                 CONTRACT_ABIS.realPayPayroll,
//                 provider
//             ),
//             payTagRegistry: new ethers.Contract(
//                 CONTRACT_ADDRESSES.payTagRegistry,
//                 CONTRACT_ABIS.payTagRegistry,
//                 provider
//             ),
//             rwaAssetRegistry: new ethers.Contract(
//                 CONTRACT_ADDRESSES.rwaAssetRegistry,
//                 CONTRACT_ABIS.rwaAssetRegistry,
//                 provider
//             ),
//             airtimeConverter: new ethers.Contract(
//                 CONTRACT_ADDRESSES.airtimeConverter,
//                 CONTRACT_ABIS.airtimeConverter,
//                 provider
//             ),
//             lock: new ethers.Contract(
//                 CONTRACT_ADDRESSES.lock,
//                 CONTRACT_ABIS.lock,
//                 provider
//             ),
//         };
//     } catch (error) {
//         logger.error('Failed to initialize contracts:', error);
//         throw error;
//     }
// };


// export async function checkNetwork() {
//     const network = await provider.getNetwork();
//     console.log(network.chainId, network.name);
//     return network;
// }


// export { provider, getContracts };

import { ethers } from 'ethers';
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from './contracts';
import logger from '../utils/logger';
import dotenv from "dotenv";

dotenv.config();

interface AppContracts {
    realStableCoin: ethers.Contract;
    realPayPayroll: ethers.Contract;
    payTagRegistry: ethers.Contract;
    rwaAssetRegistry: ethers.Contract;
    airtimeConverter: ethers.Contract;
    lock: ethers.Contract;
}

// Enhanced provider configuration
// Update your providerOptions in web3.ts
const providerOptions = {
    chainId: process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 50002,
    name: process.env.NETWORK_NAME || "custom",
    // Explicitly disable ENS
    ensAddress: undefined,
    // Disable ENS resolution entirely
    ensNetwork: undefined
};
// const providerOptions = {
//     chainId: process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 50002,
//     name: process.env.NETWORK_NAME || "custom",
//     ensAddress: undefined
// };

// Create provider with retry logic
const createProvider = (): ethers.JsonRpcProvider => {
    const provider = new ethers.JsonRpcProvider(
        process.env.PHAROS_DEVNET_URL,
        providerOptions,
    );

    provider.on('error', (error) => {
        logger.error('Provider error:', error);
    });

    return provider;
};

const provider = createProvider();

// Initialize contracts with proper typing
// const getContracts = (): AppContracts => {
//     const createContract = <T extends ethers.Contract>(address: string, abi: any): T => {
//         try {
//             return new ethers.Contract(address, abi, provider) as T;
//         } catch (error) {
//             logger.error(`Failed to create contract at ${address}:`, error);
//             throw error;
//         }
//     };

//     try {
//         return {
//             realStableCoin: createContract<ethers.Contract>(
//                 CONTRACT_ADDRESSES.realStableCoin,
//                 CONTRACT_ABIS.realStableCoin
//             ),
//             realPayPayroll: createContract<ethers.Contract>(
//                 CONTRACT_ADDRESSES.realPayPayroll,
//                 CONTRACT_ABIS.realPayPayroll
//             ),
//             payTagRegistry: createContract<ethers.Contract>(
//                 CONTRACT_ADDRESSES.payTagRegistry,
//                 CONTRACT_ABIS.payTagRegistry
//             ),
//             rwaAssetRegistry: createContract<ethers.Contract>(
//                 CONTRACT_ADDRESSES.rwaAssetRegistry,
//                 CONTRACT_ABIS.rwaAssetRegistry
//             ),
//             airtimeConverter: createContract<ethers.Contract>(
//                 CONTRACT_ADDRESSES.airtimeConverter,
//                 CONTRACT_ABIS.airtimeConverter
//             ),
//             lock: createContract<ethers.Contract>(
//                 CONTRACT_ADDRESSES.lock,
//                 CONTRACT_ABIS.lock
//             )
//         };
//     } catch (error) {
//         logger.error('Failed to initialize contracts:', error);
//         throw error;
//     }
// };

// Update your getContracts function
const getContracts = (): AppContracts => {
    const createContract = <T extends ethers.Contract>(address: string, abi: any): T => {
        if (!address || !abi) {
            throw new Error(`Missing address or ABI for contract`);
        }
        return new ethers.Contract(address, abi, provider) as T;
    };

    try {
        // Verify all required addresses and ABIs are present
        const requiredContracts = ['realStableCoin', 'realPayPayroll', 'payTagRegistry', 'rwaAssetRegistry', 'airtimeConverter', 'lock'] as const;
        for (const contractName of requiredContracts) {
            if (!CONTRACT_ADDRESSES[contractName as keyof typeof CONTRACT_ADDRESSES] ||
                !CONTRACT_ABIS[contractName as keyof typeof CONTRACT_ABIS]) {
                throw new Error(`Missing configuration for ${contractName} contract`);
            }
        }
        return {
            realStableCoin: createContract<ethers.Contract>(
                CONTRACT_ADDRESSES.realStableCoin,
                CONTRACT_ABIS.realStableCoin
            ),
            realPayPayroll: createContract<ethers.Contract>(
                CONTRACT_ADDRESSES.realPayPayroll,
                CONTRACT_ABIS.realPayPayroll
            ),
            payTagRegistry: createContract<ethers.Contract>(
                CONTRACT_ADDRESSES.payTagRegistry,
                CONTRACT_ABIS.payTagRegistry
            ),
            rwaAssetRegistry: createContract<ethers.Contract>(
                CONTRACT_ADDRESSES.rwaAssetRegistry,
                CONTRACT_ABIS.rwaAssetRegistry
            ),
            airtimeConverter: createContract<ethers.Contract>(
                CONTRACT_ADDRESSES.airtimeConverter,
                CONTRACT_ABIS.airtimeConverter
            ),
            lock: createContract<ethers.Contract>(
                CONTRACT_ADDRESSES.lock,
                CONTRACT_ABIS.lock
            )
        };
    } catch (error) {
        logger.error('Failed to initialize contracts:', error);
        throw new Error('Contract initialization failed. Check contract configurations.');
    }
};

// Enhanced network check with retry logic
export async function checkNetwork(retries = 3, delay = 1000): Promise<ethers.Network> {
    for (let i = 0; i < retries; i++) {
        try {
            const network = await provider.getNetwork();
            logger.info(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
            return network;
        } catch (error) {
            if (i === retries - 1) throw error;
            logger.warn(`Network check failed (attempt ${i + 1}/${retries}), retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Failed to check network after retries');
}

// Improved polling listener with proper types
export function setupPollingListener(
    contract: ethers.Contract,
    eventName: string,
    callback: (event: ethers.EventLog) => void,
    interval = 15000
): () => void {
    let lastBlock = -1;
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const poll = async () => {
        if (!isActive) return;

        try {
            const currentBlock = await provider.getBlockNumber();
            if (lastBlock === -1) {
                lastBlock = currentBlock - 1;
            }

            if (currentBlock > lastBlock) {
                try {
                    const events = await contract.queryFilter(
                        contract.filters[eventName](),
                        lastBlock,
                        currentBlock
                    );

                    for (const event of events) {
                        if ('args' in event) {
                            callback(event as ethers.EventLog);
                        }
                    }

                    lastBlock = currentBlock;
                } catch (filterError) {
                    logger.error(`Error querying ${eventName} events:`, filterError);
                }
            }
        } catch (error) {
            logger.error(`Error polling ${eventName}:`, error);
        } finally {
            if (isActive) {
                timeoutId = setTimeout(poll, interval);
            }
        }
    };

    poll();

    return () => {
        isActive = false;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}

export { provider, getContracts };