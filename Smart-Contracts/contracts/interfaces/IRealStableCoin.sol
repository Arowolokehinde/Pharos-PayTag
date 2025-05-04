// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRealStableCoin
 * @dev Interface for the RealPay StableCoin (RPSC)
 */
interface IRealStableCoin {
    /**
     * @dev Event emitted when tokens are minted
     */
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Event emitted when tokens are burned
     */
    event TokensBurned(address indexed from, uint256 amount);
    
    /**
     * @dev Event emitted when collateralization ratio is updated
     */
    event CollateralizationRatioUpdated(uint256 oldRatio, uint256 newRatio);

    /**
     * @dev Mints new tokens if the caller has sufficient collateral
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     * @return success Whether the minting was successful
     */
    function mint(address to, uint256 amount) external returns (bool);
    
    /**
     * @dev Burns tokens from the caller's balance
     * @param amount The amount of tokens to burn
     * @return success Whether the burning was successful
     */
    function burn(uint256 amount) external returns (bool);
    
    /**
     * @dev Burns tokens from a specific address (requires approval)
     * @param from The address from which to burn tokens
     * @param amount The amount of tokens to burn
     * @return success Whether the burning was successful
     */
    function burnFrom(address from, uint256 amount) external returns (bool);
    
    /**
     * @dev Sets the collateralization ratio required for minting
     * @param newRatio The new collateralization ratio (e.g., 150 = 150%)
     * @return success Whether the update was successful
     */
    function setCollateralizationRatio(uint256 newRatio) external returns (bool);
    
    /**
     * @dev Gets the current collateralization ratio
     * @return The current collateralization ratio
     */
    function getCollateralizationRatio() external view returns (uint256);
    
    /**
     * @dev Checks if an address can mint a specific amount of tokens
     * @param minter The address to check
     * @param amount The amount of tokens to check
     * @return Whether the address can mint the specified amount
     */
    function canMint(address minter, uint256 amount) external view returns (bool);
}