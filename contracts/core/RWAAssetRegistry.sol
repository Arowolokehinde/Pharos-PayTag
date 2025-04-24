// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RWAAssetRegistry
 * @dev Registry for real-world assets with ownership tracking and verification
 */
contract RWAAssetRegistry is Ownable, Pausable {
    using Counters for Counters.Counter;
    
    // Asset categories
    enum AssetCategory {
        REAL_ESTATE,
        VEHICLE,
        EQUIPMENT,
        INTELLECTUAL_PROPERTY,
        OTHER
    }
    
    // Asset status
    enum AssetStatus {
        ACTIVE,
        INACTIVE,
        PENDING_VERIFICATION,
        VERIFIED,
        DISPUTED
    }
    
    // Asset struct
    struct Asset {
        string name;
        string description;
        string location;
        string metadata;
        AssetCategory category;
        AssetStatus status;
        address owner;
        uint256 value;
        uint256 registrationDate;
        uint256 lastUpdateDate;
        bool isVerified;
    }
    
    // Mapping from asset ID to Asset struct
    mapping(uint256 => Asset) private _assets;
    
    // Mapping from owner address to array of asset IDs
    mapping(address => uint256[]) private _ownerAssets;
    
    // Counter for asset IDs
    Counters.Counter private _assetCounter;
    
    // Events
    event AssetRegistered(uint256 indexed assetId, address indexed owner, AssetCategory category);
    event AssetUpdated(uint256 indexed assetId, address indexed owner);
    event AssetTransferred(uint256 indexed assetId, address indexed from, address indexed to);
    event AssetStatusChanged(uint256 indexed assetId, AssetStatus newStatus);
    event AssetVerified(uint256 indexed assetId, address indexed verifier);
    
    constructor() {}
    
    /**
     * @dev Register a new asset
     * @param name The name of the asset
     * @param description The description of the asset
     * @param location The physical location of the asset
     * @param metadata Additional metadata about the asset
     * @param category The category of the asset
     * @param value The estimated value of the asset
     */
    function registerAsset(
        string memory name,
        string memory description,
        string memory location,
        string memory metadata,
        AssetCategory category,
        uint256 value
    ) external whenNotPaused {
        require(bytes(name).length > 0, "RWAAssetRegistry: name cannot be empty");
        require(value > 0, "RWAAssetRegistry: value must be greater than 0");
        
        _assetCounter.increment();
        uint256 assetId = _assetCounter.current();
        
        _assets[assetId] = Asset({
            name: name,
            description: description,
            location: location,
            metadata: metadata,
            category: category,
            status: AssetStatus.PENDING_VERIFICATION,
            owner: msg.sender,
            value: value,
            registrationDate: block.timestamp,
            lastUpdateDate: block.timestamp,
            isVerified: false
        });
        
        _ownerAssets[msg.sender].push(assetId);
        
        emit AssetRegistered(assetId, msg.sender, category);
    }
    
    /**
     * @dev Update asset information
     * @param assetId The ID of the asset
     * @param name The new name of the asset
     * @param description The new description of the asset
     * @param location The new location of the asset
     * @param metadata The new metadata of the asset
     * @param value The new value of the asset
     */
    function updateAsset(
        uint256 assetId,
        string memory name,
        string memory description,
        string memory location,
        string memory metadata,
        uint256 value
    ) external whenNotPaused {
        require(assetId > 0 && assetId <= _assetCounter.current(), "RWAAssetRegistry: invalid asset ID");
        require(_assets[assetId].owner == msg.sender, "RWAAssetRegistry: not the asset owner");
        require(_assets[assetId].status != AssetStatus.DISPUTED, "RWAAssetRegistry: asset is disputed");
        require(bytes(name).length > 0, "RWAAssetRegistry: name cannot be empty");
        require(value > 0, "RWAAssetRegistry: value must be greater than 0");
        
        Asset storage asset = _assets[assetId];
        asset.name = name;
        asset.description = description;
        asset.location = location;
        asset.metadata = metadata;
        asset.value = value;
        asset.lastUpdateDate = block.timestamp;
        
        emit AssetUpdated(assetId, msg.sender);
    }
    
    /**
     * @dev Transfer asset ownership
     * @param assetId The ID of the asset
     * @param newOwner The new owner's address
     */
    function transferAsset(uint256 assetId, address newOwner) external whenNotPaused {
        require(assetId > 0 && assetId <= _assetCounter.current(), "RWAAssetRegistry: invalid asset ID");
        require(_assets[assetId].owner == msg.sender, "RWAAssetRegistry: not the asset owner");
        require(newOwner != address(0), "RWAAssetRegistry: invalid new owner address");
        require(_assets[assetId].status != AssetStatus.DISPUTED, "RWAAssetRegistry: asset is disputed");
        
        address oldOwner = _assets[assetId].owner;
        _assets[assetId].owner = newOwner;
        _assets[assetId].lastUpdateDate = block.timestamp;
        
        // Remove asset from old owner's list
        uint256[] storage oldOwnerAssets = _ownerAssets[oldOwner];
        for (uint256 i = 0; i < oldOwnerAssets.length; i++) {
            if (oldOwnerAssets[i] == assetId) {
                oldOwnerAssets[i] = oldOwnerAssets[oldOwnerAssets.length - 1];
                oldOwnerAssets.pop();
                break;
            }
        }
        
        // Add asset to new owner's list
        _ownerAssets[newOwner].push(assetId);
        
        emit AssetTransferred(assetId, oldOwner, newOwner);
    }
    
    /**
     * @dev Change asset status (only owner)
     * @param assetId The ID of the asset
     * @param newStatus The new status
     */
    function changeAssetStatus(uint256 assetId, AssetStatus newStatus) external onlyOwner {
        require(assetId > 0 && assetId <= _assetCounter.current(), "RWAAssetRegistry: invalid asset ID");
        
        _assets[assetId].status = newStatus;
        _assets[assetId].lastUpdateDate = block.timestamp;
        
        emit AssetStatusChanged(assetId, newStatus);
    }
    
    /**
     * @dev Verify an asset (only owner)
     * @param assetId The ID of the asset
     */
    function verifyAsset(uint256 assetId) external onlyOwner {
        require(assetId > 0 && assetId <= _assetCounter.current(), "RWAAssetRegistry: invalid asset ID");
        
        Asset storage asset = _assets[assetId];
        asset.isVerified = true;
        asset.status = AssetStatus.VERIFIED;
        asset.lastUpdateDate = block.timestamp;
        
        emit AssetVerified(assetId, msg.sender);
    }
    
    /**
     * @dev Get asset information
     * @param assetId The ID of the asset
     * @return name The asset name
     * @return description The asset description
     * @return location The asset location
     * @return metadata The asset metadata
     * @return category The asset category
     * @return status The asset status
     * @return owner The asset owner
     * @return value The asset value
     * @return registrationDate The registration date
     * @return lastUpdateDate The last update date
     * @return isVerified The verification status
     */
    function getAsset(uint256 assetId) external view returns (
        string memory name,
        string memory description,
        string memory location,
        string memory metadata,
        AssetCategory category,
        AssetStatus status,
        address owner,
        uint256 value,
        uint256 registrationDate,
        uint256 lastUpdateDate,
        bool isVerified
    ) {
        require(assetId > 0 && assetId <= _assetCounter.current(), "RWAAssetRegistry: invalid asset ID");
        
        Asset storage asset = _assets[assetId];
        return (
            asset.name,
            asset.description,
            asset.location,
            asset.metadata,
            asset.category,
            asset.status,
            asset.owner,
            asset.value,
            asset.registrationDate,
            asset.lastUpdateDate,
            asset.isVerified
        );
    }
    
    /**
     * @dev Get assets owned by an address
     * @param owner The owner's address
     * @return Array of asset IDs
     */
    function getAssetsByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerAssets[owner];
    }
    
    /**
     * @dev Pause all registry operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause all registry operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
