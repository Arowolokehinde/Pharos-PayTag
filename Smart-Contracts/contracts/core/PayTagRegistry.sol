// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPayTagRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title PayTagRegistry
 * @dev Maps PayTags (@usernames) to wallet addresses
 */
contract PayTagRegistry is IPayTagRegistry, Ownable {
    // Mapping from PayTag to wallet address
    mapping(string => address) private _tagToAddress;
    
    // Mapping from PayTag to owner address
    mapping(string => address) private _tagToOwner;
    
    // Mapping from wallet address to PayTags owned
    mapping(address => string[]) private _addressToTags;
    
    // Array of all registered PayTags
    string[] private _allTags;
    
    // Minimum and maximum PayTag length
    uint8 private constant MIN_TAG_LENGTH = 3;
    uint8 private constant MAX_TAG_LENGTH = 20;
    
    constructor() {}
    
    /**
     * @dev See {IPayTagRegistry-registerTag}
     */
    function registerTag(string calldata tag) external override returns (bool) {
        // Validate tag length
        bytes memory tagBytes = bytes(tag);
        require(tagBytes.length >= MIN_TAG_LENGTH, "PayTagRegistry: Tag too short");
        require(tagBytes.length <= MAX_TAG_LENGTH, "PayTagRegistry: Tag too long");
        
        // Check if tag is available
        require(isTagAvailable(tag), "PayTagRegistry: Tag already registered");
        
        // Check tag format (alphanumeric and underscore only)
        for (uint i = 0; i < tagBytes.length; i++) {
            bytes1 char = tagBytes[i];
            require(
                (char >= 0x30 && char <= 0x39) || // 0-9
                (char >= 0x41 && char <= 0x5A) || // A-Z
                (char >= 0x61 && char <= 0x7A) || // a-z
                char == 0x5F, // underscore
                "PayTagRegistry: Invalid character in tag"
            );
        }
        
        // Register tag
        _tagToAddress[tag] = msg.sender;
        _tagToOwner[tag] = msg.sender;
        _addressToTags[msg.sender].push(tag);
        _allTags.push(tag);
        
        emit TagRegistered(tag, msg.sender);
        return true;
    }
    
    /**
     * @dev See {IPayTagRegistry-resolveTag}
     */
    function resolveTag(string calldata tag) external view override returns (address) {
        require(_tagToOwner[tag] != address(0), "PayTagRegistry: Tag not registered");
        return _tagToAddress[tag];
    }
    
    /**
     * @dev See {IPayTagRegistry-updateTag}
     */
    function updateTag(string calldata tag, address newAddress) external override returns (bool) {
        require(_tagToOwner[tag] == msg.sender, "PayTagRegistry: Not tag owner");
        require(newAddress != address(0), "PayTagRegistry: Invalid address");
        
        address oldAddress = _tagToAddress[tag];
        _tagToAddress[tag] = newAddress;
        
        emit TagUpdated(tag, oldAddress, newAddress);
        return true;
    }
    
    /**
     * @dev See {IPayTagRegistry-transferTag}
     */
    function transferTag(string calldata tag, address newOwner) external override returns (bool) {
        require(_tagToOwner[tag] == msg.sender, "PayTagRegistry: Not tag owner");
        require(newOwner != address(0), "PayTagRegistry: Invalid address");
        
        // Update owner
        address oldOwner = _tagToOwner[tag];
        _tagToOwner[tag] = newOwner;
        
        // Update address mappings
        _removeTagFromOwner(oldOwner, tag);
        _addressToTags[newOwner].push(tag);
        
        // Set the address to the new owner as well
        _tagToAddress[tag] = newOwner;
        
        emit TagTransferred(tag, oldOwner, newOwner);
        return true;
    }
    
    /**
     * @dev See {IPayTagRegistry-isTagAvailable}
     */
    function isTagAvailable(string calldata tag) public view override returns (bool) {
        return _tagToOwner[tag] == address(0);
    }
    
    /**
     * @dev See {IPayTagRegistry-getTagOwner}
     */
    function getTagOwner(string calldata tag) external view override returns (address) {
        return _tagToOwner[tag];
    }
    
    /**
     * @dev Gets all tags owned by an address
     * @param owner The address to check
     * @return All tags owned by the address
     */
    function getTagsByOwner(address owner) external view returns (string[] memory) {
        return _addressToTags[owner];
    }
    
    /**
     * @dev Gets all registered tags
     * @return Array of all registered tags
     */
    function getAllTags() external view returns (string[] memory) {
        return _allTags;
    }
    
    /**
     * @dev Internal function to remove a tag from an owner's list
     * @param owner The owner address
     * @param tag The tag to remove
     */
    function _removeTagFromOwner(address owner, string memory tag) private {
        string[] storage ownerTags = _addressToTags[owner];
        for (uint i = 0; i < ownerTags.length; i++) {
            if (keccak256(bytes(ownerTags[i])) == keccak256(bytes(tag))) {
                // Move the last element to the deleted spot
                ownerTags[i] = ownerTags[ownerTags.length - 1];
                // Remove the last element
                ownerTags.pop();
                break;
            }
        }
    }
}