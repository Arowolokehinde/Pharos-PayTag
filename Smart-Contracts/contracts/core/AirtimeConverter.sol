// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./RealStableCoin.sol";

/**
 * @title AirtimeConverter
 * @dev Handles conversion between airtime and stablecoin
 */
contract AirtimeConverter is Ownable, Pausable, ReentrancyGuard {
    // Reference to the RealStableCoin contract
    RealStableCoin private _stableCoin;
    
    // Conversion rates for different networks
    struct NetworkRate {
        string networkName;
        uint256 rate; // amount of stablecoin per unit of airtime
        bool isActive;
    }
    
    // Mapping from network ID to NetworkRate
    mapping(uint256 => NetworkRate) private _networkRates;
    
    // Counter for network IDs
    uint256 private _networkCounter;
    
    // Events
    event NetworkAdded(uint256 indexed networkId, string networkName, uint256 rate);
    event NetworkUpdated(uint256 indexed networkId, uint256 newRate);
    event NetworkDeactivated(uint256 indexed networkId);
    event AirtimeConverted(
        uint256 indexed networkId,
        address indexed user,
        uint256 airtimeAmount,
        uint256 stablecoinAmount
    );
    
    constructor(address stableCoinAddress) {
        require(stableCoinAddress != address(0), "AirtimeConverter: invalid stablecoin address");
        _stableCoin = RealStableCoin(stableCoinAddress);
    }
    
    /**
     * @dev Add a new network with its conversion rate
     * @param networkName The name of the network
     * @param rate The conversion rate (amount of stablecoin per unit of airtime)
     */
    function addNetwork(string memory networkName, uint256 rate) external onlyOwner {
        require(bytes(networkName).length > 0, "AirtimeConverter: network name cannot be empty");
        require(rate > 0, "AirtimeConverter: rate must be greater than 0");
        
        _networkCounter++;
        _networkRates[_networkCounter] = NetworkRate({
            networkName: networkName,
            rate: rate,
            isActive: true
        });
        
        emit NetworkAdded(_networkCounter, networkName, rate);
    }
    
    /**
     * @dev Update a network's conversion rate
     * @param networkId The ID of the network
     * @param newRate The new conversion rate
     */
    function updateNetworkRate(uint256 networkId, uint256 newRate) external onlyOwner {
        require(networkId > 0 && networkId <= _networkCounter, "AirtimeConverter: invalid network ID");
        require(newRate > 0, "AirtimeConverter: rate must be greater than 0");
        require(_networkRates[networkId].isActive, "AirtimeConverter: network is inactive");
        
        _networkRates[networkId].rate = newRate;
        
        emit NetworkUpdated(networkId, newRate);
    }
    
    /**
     * @dev Deactivate a network
     * @param networkId The ID of the network
     */
    function deactivateNetwork(uint256 networkId) external onlyOwner {
        require(networkId > 0 && networkId <= _networkCounter, "AirtimeConverter: invalid network ID");
        require(_networkRates[networkId].isActive, "AirtimeConverter: network is already inactive");
        
        _networkRates[networkId].isActive = false;
        
        emit NetworkDeactivated(networkId);
    }
    
    /**
     * @dev Convert airtime to stablecoin
     * @param networkId The ID of the network
     * @param airtimeAmount The amount of airtime to convert
     */
    function convertAirtimeToStablecoin(uint256 networkId, uint256 airtimeAmount) external nonReentrant whenNotPaused {
        require(networkId > 0 && networkId <= _networkCounter, "AirtimeConverter: invalid network ID");
        require(airtimeAmount > 0, "AirtimeConverter: amount must be greater than 0");
        require(_networkRates[networkId].isActive, "AirtimeConverter: network is inactive");
        
        NetworkRate storage network = _networkRates[networkId];
        uint256 stablecoinAmount = (airtimeAmount * network.rate) / 1e18;
        
        require(
            _stableCoin.transferFrom(msg.sender, address(this), stablecoinAmount),
            "AirtimeConverter: transfer failed"
        );
        
        emit AirtimeConverted(networkId, msg.sender, airtimeAmount, stablecoinAmount);
    }
    
    /**
     * @dev Get network information
     * @param networkId The ID of the network
     * @return networkName The name of the network
     * @return rate The conversion rate
     * @return isActive Whether the network is active
     */
    function getNetwork(uint256 networkId) external view returns (
        string memory networkName,
        uint256 rate,
        bool isActive
    ) {
        require(networkId > 0 && networkId <= _networkCounter, "AirtimeConverter: invalid network ID");
        
        NetworkRate storage network = _networkRates[networkId];
        return (
            network.networkName,
            network.rate,
            network.isActive
        );
    }
    
    /**
     * @dev Withdraw stablecoins from the contract (only owner)
     * @param amount The amount to withdraw
     */
    function withdrawStablecoins(uint256 amount) external onlyOwner {
        require(amount > 0, "AirtimeConverter: amount must be greater than 0");
        require(
            _stableCoin.transfer(owner(), amount),
            "AirtimeConverter: withdrawal failed"
        );
    }
    
    /**
     * @dev Pause all conversion operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause all conversion operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
