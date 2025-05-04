import { ethers } from 'ethers';
import { provider } from '../config/web3';
import logger from './logger';

/**
 * Validates an Ethereum address
 * @param address - The address to validate
 * @returns Boolean indicating if address is valid
 */
export const isValidAddress = (address: string): boolean => {
    try {
        return ethers.isAddress(address);
    } catch (error) {
        return false;
    }
};

/**
 * Creates a message for signing
 * @param nonce - A unique nonce for the user
 * @returns String message to be signed
 */
export const createSignMessage = (nonce: string): string => {
    return `Please sign this message to verify your identity: ${nonce}`;
};

/**
 * Verifies a signature against a message and expected address
 * @param signature - The signature to verify
 * @param message - The original message that was signed
 * @param expectedAddress - The address expected to have signed the message
 * @returns Boolean indicating if signature is valid
 */
export const verifySignature = (
    signature: string,
    message: string,
    expectedAddress: string
): boolean => {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
        logger.error('Error verifying signature:', error);
        return false;
    }
};

/**
 * Formats value from wei to ether
 * @param value - Wei value as string or bigint
 * @returns Formatted ether value as string
 */
export const formatEther = (value: string | bigint): string => {
    try {
        return ethers.formatEther(value);
    } catch (error) {
        logger.error('Error formatting ether:', error);
        return '0';
    }
};

/**
 * Parses ether value to wei
 * @param value - Ether value as string
 * @returns Wei value as bigint
 */
export const parseEther = (value: string): bigint => {
    try {
        return ethers.parseEther(value);
    } catch (error) {
        logger.error('Error parsing ether:', error);
        return 0n;
    }
};

/**
 * Gets transaction receipt
 * @param txHash - Transaction hash
 * @returns Promise of transaction receipt
 */
export const getTransactionReceipt = async (
    txHash: string
): Promise<ethers.TransactionReceipt | null> => {
    try {
        return await provider.getTransactionReceipt(txHash);
    } catch (error) {
        logger.error('Error getting transaction receipt:', error);
        return null;
    }
};