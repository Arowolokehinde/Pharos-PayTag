// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title RealStableCoin
 * @dev A stablecoin implementation with minting and burning capabilities
 */
contract RealStableCoin is ERC20, Ownable, Pausable {
    // Mapping to track authorized minters
    mapping(address => bool) private _minters;
    
    // Events
    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    
    constructor() ERC20("Real Stable Coin", "RSC") {
        // Initial supply of 0, tokens will be minted as needed
    }
    
    /**
     * @dev Modifier to check if the caller is a minter
     */
    modifier onlyMinter() {
        require(_minters[msg.sender], "RealStableCoin: caller is not a minter");
        _;
    }
    
    /**
     * @dev Add a minter
     * @param account The address to add as a minter
     */
    function addMinter(address account) external onlyOwner {
        require(account != address(0), "RealStableCoin: invalid address");
        _minters[account] = true;
        emit MinterAdded(account);
    }
    
    /**
     * @dev Remove a minter
     * @param account The address to remove as a minter
     */
    function removeMinter(address account) external onlyOwner {
        require(account != address(0), "RealStableCoin: invalid address");
        _minters[account] = false;
        emit MinterRemoved(account);
    }
    
    /**
     * @dev Check if an address is a minter
     * @param account The address to check
     * @return bool Whether the address is a minter
     */
    function isMinter(address account) external view returns (bool) {
        return _minters[account];
    }
    
    /**
     * @dev Mint new tokens
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        require(to != address(0), "RealStableCoin: mint to the zero address");
        _mint(to, amount);
        emit Minted(to, amount);
    }
    
    /**
     * @dev Burn tokens
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external whenNotPaused {
        _burn(msg.sender, amount);
        emit Burned(msg.sender, amount);
    }
    
    /**
     * @dev Pause all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause all token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override ERC20 transfer to include pausable functionality
     */
    function _transfer(address from, address to, uint256 value) internal override whenNotPaused {
        super._transfer(from, to, value);
    }
}
