# Pharos PayTag Backend

A comprehensive blockchain-based payment and asset management system built on Pharos Blockchain (Pharos). This project includes smart contracts for stablecoin management, payroll processing, digital identity management through PayTags, real-world asset registry, and airtime conversion.

## Smart Contracts

### RealStableCoin
- ERC20 stablecoin implementation
- Minting and burning capabilities
- Role-based minter management
- Pausable functionality for emergency situations

### RealPayPayroll
- Automated payroll management system
- Employee registration and management
- Scheduled payment processing
- Salary updates and employee deactivation
- Integration with RealStableCoin for payments

### PayTagRegistry
- Digital identity management through @tags
- Username to wallet address mapping
- Secure ownership and transfer system
- Alphanumeric username validation
- Tag resolution and lookup functionality

### RWAAssetRegistry
- Real-world asset registration and tracking
- Multiple asset categories (Real Estate, Vehicle, etc.)
- Asset verification system
- Ownership transfer management
- Detailed asset information storage

### AirtimeConverter
- Airtime to stablecoin conversion
- Network rate management
- Multiple carrier support
- Secure conversion process
- Integration with RealStableCoin

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MetaMask wallet
- Test MATIC (for Pharos testnet)

### Installation
```shell
# Clone the repository
git clone https://github.com/yourusername/RealPayTag-backend.git

# Install dependencies
npm install
```

### Configuration
Create a `.env` file in the root directory:
```env
PHAROS_DEVNET_URL=https://devnet.dplabs-internal.com
PRIVATE_KEY=your_wallet_private_key
```

### Testing
Run the test suite to ensure everything is working correctly:
```shell
# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/RealStableCoin.test.js
```

### Deployment
Deploy the contracts to Pharos testnet:
```shell
npx hardhat run scripts/deploy.js --network pharosDevnet
```

### Network Configuration
Add Pharos network to MetaMask:
- Network Name: Pharos Devnet
- RPC URL: https://devnet.dplabs-internal.com
- Chain ID: 2525
- Currency Symbol: MATIC
- Block Explorer URL: https://explorer.dplabs-internal.com

## Contract Interaction

### Using Hardhat Console
```shell
npx hardhat console --network pharosDevnet
```

### Example Interactions
```javascript
// Get contract instance
const RealStableCoin = await ethers.getContractFactory("RealStableCoin");
const coin = await RealStableCoin.attach("DEPLOYED_CONTRACT_ADDRESS");

// Mint tokens (if you're a minter)
await coin.mint("RECIPIENT_ADDRESS", "AMOUNT");
```

## Security

- All contracts inherit from OpenZeppelin's secure contract implementations
- Role-based access control for sensitive operations
- Pausable functionality for emergency situations
- Reentrancy protection where necessary
- Comprehensive test coverage

## Development

### Running a Local Node
```shell
npx hardhat node
```

### Compiling Contracts
```shell
npx hardhat compile
```

### Code Style
```shell
# Run solhint
npx solhint 'contracts/**/*.sol'
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.



## Acknowledgments
- OpenZeppelin for secure contract implementations
- Hardhat development environment
- Polygon Labs for Pharos testnet


## Deployed on Pharos Blockchain
- RealStableCoin deployed to: 0xB47E4082bAc11d0ED283bA020b87461D321F21e9
- RealPayPayroll deployed to: 0x0e4EEe5abe554f3b47FE4c3AcF852AB9f14df62A
- PayTagRegistry deployed to: 0x6b5128B0820e1cF81bd2e248Adb17122236DDbB9
- RWAAssetRegistry deployed to: 0x463403783fEd32d43478BDaCa3E09d604E6fb8Bf
- AirtimeConverter deployed to: 0x7bDD184DEA5C3271169DeE8A742046Eef63d2b70
- RealPayPayroll added as minter
- AirtimeConverter added as minter

## Contract addresses:
- RealStableCoin: 0xB47E4082bAc11d0ED283bA020b87461D321F21e9
- RealPayPayroll: 0x0e4EEe5abe554f3b47FE4c3AcF852AB9f14df62A
- PayTagRegistry: 0x6b5128B0820e1cF81bd2e248Adb17122236DDbB9
- RWAAssetRegistry: 0x463403783fEd32d43478BDaCa3E09d604E6fb8Bf
- AirtimeConverter: 0x7bDD184DEA5C3271169DeE8A742046Eef63d2b70