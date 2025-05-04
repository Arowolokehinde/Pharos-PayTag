// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPayTagRegistry
 * @dev Interface for the PayTag Registry contract
 */
interface IPayTagRegistry {
    /**
     * @dev Event emitted when a new PayTag is registered
     */
    event TagRegistered(string indexed tag, address indexed owner);
    
    /**
     * @dev Event emitted when a PayTag's linked address is updated
     */
    event TagUpdated(string indexed tag, address indexed oldAddress, address indexed newAddress);
    
    /**
     * @dev Event emitted when a PayTag is transferred to another owner
     */
    event TagTransferred(string indexed tag, address indexed oldOwner, address indexed newOwner);

    /**
     * @dev Registers a new PayTag for the caller
     * @param tag The PayTag to register (without the @ symbol)
     * @return success Whether the registration was successful
     */
    function registerTag(string calldata tag) external returns (bool);
    
    /**
     * @dev Resolves a PayTag to its associated wallet address
     * @param tag The PayTag to resolve (without the @ symbol)
     * @return The wallet address associated with the PayTag
     */
    function resolveTag(string calldata tag) external view returns (address);
    
    /**
     * @dev Updates the wallet address linked to a PayTag
     * @param tag The PayTag to update (must be owned by caller)
     * @param newAddress The new wallet address to link to the PayTag
     * @return success Whether the update was successful
     */
    function updateTag(string calldata tag, address newAddress) external returns (bool);
    
    /**
     * @dev Transfers ownership of a PayTag to another address
     * @param tag The PayTag to transfer (must be owned by caller)
     * @param newOwner The new owner address
     * @return success Whether the transfer was successful
     */
    function transferTag(string calldata tag, address newOwner) external returns (bool);
    
    /**
     * @dev Checks if a PayTag is available for registration
     * @param tag The PayTag to check
     * @return Whether the PayTag is available
     */
    function isTagAvailable(string calldata tag) external view returns (bool);
    
    /**
     * @dev Gets the owner of a PayTag
     * @param tag The PayTag to check ownership
     * @return The owner address of the PayTag
     */
    function getTagOwner(string calldata tag) external view returns (address);
}