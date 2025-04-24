// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRWAAssetRegistry
 * @dev Interface for the Real-World Asset Registry contract
 */
interface IRWAAssetRegistry {
    /**
     * @dev Struct for RWA details
     */
    struct RWAAsset {
        string assetId;          // Unique identifier for the asset
        string assetType;        // Type of asset (e.g., "real_estate", "t_bill")
        uint256 valueUSD;        // Value in USD (with 18 decimals)
        address owner;           // Owner of the asset
        bool isActive;           // Whether the asset is active or not
    }

    /**
     * @dev Event emitted when a new asset is registered
     */
    event AssetRegistered(string indexed assetId, address indexed owner, uint256 valueUSD);
    
    /**
     * @dev Event emitted when an asset's value is updated
     */
    event AssetValueUpdated(string indexed assetId, uint256 oldValue, uint256 newValue);
    
    /**
     * @dev Event emitted when an asset is deactivated
     */
    event AssetDeactivated(string indexed assetId);

    /**
     * @dev Registers a new real-world asset
     * @param assetId Unique identifier for the asset
     * @param assetType Type of the asset
     * @param valueUSD Value of the asset in USD (with 18 decimals)
     * @return success Whether the registration was successful
     */
    function registerAsset(string calldata assetId, string calldata assetType, uint256 valueUSD) external returns (bool);
    
    /**
     * @dev Updates the value of an existing asset
     * @param assetId The asset to update
     * @param newValueUSD The new USD value for the asset
     * @return success Whether the update was successful
     */
    function updateAssetValue(string calldata assetId, uint256 newValueUSD) external returns (bool);
    
    /**
     * @dev Gets the total collateral value for a specific owner
     * @param owner The address to check
     * @return The total value of all active assets owned by the address
     */
    function getCollateralValue(address owner) external view returns (uint256);
    
    /**
     * @dev Gets details for a specific asset
     * @param assetId The asset ID to query
     * @return The RWAAsset struct containing asset details
     */
    function getAssetDetails(string calldata assetId) external view returns (RWAAsset memory);
    
    /**
     * @dev Deactivates an asset (e.g., if it's sold or no longer valid)
     * @param assetId The asset to deactivate
     * @return success Whether the deactivation was successful
     */
    function deactivateAsset(string calldata assetId) external returns (bool);
}