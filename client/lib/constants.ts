export const CONTRACT_ADDRESSES = {
    realStableCoin: "0xB47E4082bAc11d0ED283bA020b87461D321F21e9",
    realPayPayroll: "0x0e4EEe5abe554f3b47FE4c3AcF852AB9f14df62A",
    payTagRegistry: "0x6b5128B0820e1cF81bd2e248Adb17122236DDbB9",
    rwaAssetRegistry: "0x463403783fEd32d43478BDaCa3E09d604E6fb8Bf",
    airtimeConverter: "0x7bDD184DEA5C3271169DeE8A742046Eef63d2b70",
    lock: "0xghi...789",
};

export type ContractName = keyof typeof CONTRACT_ADDRESSES;

// Contract ABIs
export const CONTRACT_ABIS = {
    realStableCoin: [
        // Updated ABI based on RealStableCoin.sol
        'function name() external view returns (string)',
        'function symbol() external view returns (string)',
        'function decimals() external view returns (uint8)',
        'function totalSupply() external view returns (uint256)',
        'function balanceOf(address account) external view returns (uint256)',
        'function transfer(address to, uint256 amount) external returns (bool)',
        'function allowance(address owner, address spender) external view returns (uint256)',
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
        'function mint(address to, uint256 amount) external',
        'function burn(uint256 amount) external',
        'function pause() external',
        'function unpause() external',
        'function owner() external view returns (address)',
        'function paused() external view returns (bool)',
        'function addMinter(address account) external',
        'function removeMinter(address account) external',
        'function isMinter(address account) external view returns (bool)',
        // Events
        'event MinterAdded(address indexed account)',
        'event MinterRemoved(address indexed account)',
        'event Minted(address indexed to, uint256 amount)',
        'event Burned(address indexed from, uint256 amount)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'event Approval(address indexed owner, address indexed spender, uint256 value)',
    ],
    realPayPayroll: [
        // Updated ABI based on RealPayPayroll.sol
        'function addEmployee(address wallet, uint256 salary) external',
        'function updateEmployeeSalary(uint256 employeeId, uint256 newSalary) external',
        'function deactivateEmployee(uint256 employeeId) external',
        'function processPayroll(uint256 employeeId) external',
        'function getEmployee(uint256 employeeId) external view returns (address wallet, uint256 salary, uint256 lastPaymentDate, bool isActive)',
        'function getEmployeeIdByWallet(address wallet) external view returns (uint256)',
        'function pause() external',
        'function unpause() external',
        'function owner() external view returns (address)',
        // Events
        'event EmployeeAdded(uint256 indexed employeeId, address indexed wallet, uint256 salary)',
        'event EmployeeUpdated(uint256 indexed employeeId, uint256 newSalary)',
        'event EmployeeDeactivated(uint256 indexed employeeId)',
        'event PaymentProcessed(uint256 indexed employeeId, address indexed wallet, uint256 amount)',
    ],
    payTagRegistry: [
        // Updated ABI based on PayTagRegistry.sol
        'function registerTag(string calldata tag) external returns (bool)',
        'function resolveTag(string calldata tag) external view returns (address)',
        'function updateTag(string calldata tag, address newAddress) external returns (bool)',
        'function transferTag(string calldata tag, address newOwner) external returns (bool)',
        'function isTagAvailable(string calldata tag) external view returns (bool)',
        'function getTagOwner(string calldata tag) external view returns (address)',
        'function getTagsByOwner(address owner) external view returns (string[] memory)',
        'function getAllTags() external view returns (string[] memory)',
        'function owner() external view returns (address)',
        // Events
        'event TagRegistered(string tag, address indexed owner)',
        'event TagUpdated(string tag, address indexed oldAddress, address indexed newAddress)',
        'event TagTransferred(string tag, address indexed oldOwner, address indexed newOwner)',
    ],
    rwaAssetRegistry: [
        // Updated ABI based on RWAAssetRegistry.sol
        'function registerAsset(string memory name, string memory description, string memory location, string memory metadata, uint8 category, uint256 value) external',
        'function updateAsset(uint256 assetId, string memory name, string memory description, string memory location, string memory metadata, uint256 value) external',
        'function transferAsset(uint256 assetId, address newOwner) external',
        'function changeAssetStatus(uint256 assetId, uint8 newStatus) external',
        'function verifyAsset(uint256 assetId) external',
        'function getAsset(uint256 assetId) external view returns (string memory name, string memory description, string memory location, string memory metadata, uint8 category, uint8 status, address owner, uint256 value, uint256 registrationDate, uint256 lastUpdateDate, bool isVerified)',
        'function getAssetsByOwner(address owner) external view returns (uint256[] memory)',
        'function pause() external',
        'function unpause() external',
        'function owner() external view returns (address)',
        // Events
        'event AssetRegistered(uint256 indexed assetId, address indexed owner, uint8 category)',
        'event AssetUpdated(uint256 indexed assetId, address indexed owner)',
        'event AssetTransferred(uint256 indexed assetId, address indexed from, address indexed to)',
        'event AssetStatusChanged(uint256 indexed assetId, uint8 newStatus)',
        'event AssetVerified(uint256 indexed assetId, address indexed verifier)',
    ],
    airtimeConverter: [
        // Updated ABI based on AirtimeConverter.sol
        'function addNetwork(string memory networkName, uint256 rate) external',
        'function updateNetworkRate(uint256 networkId, uint256 newRate) external',
        'function deactivateNetwork(uint256 networkId) external',
        'function convertAirtimeToStablecoin(uint256 networkId, uint256 airtimeAmount) external',
        'function getNetwork(uint256 networkId) external view returns (string memory networkName, uint256 rate, bool isActive)',
        'function withdrawStablecoins(uint256 amount) external',
        'function pause() external',
        'function unpause() external',
        'function owner() external view returns (address)',
        // Events
        'event NetworkAdded(uint256 indexed networkId, string networkName, uint256 rate)',
        'event NetworkUpdated(uint256 indexed networkId, uint256 newRate)',
        'event NetworkDeactivated(uint256 indexed networkId)',
        'event AirtimeConverted(uint256 indexed networkId, address indexed user, uint256 airtimeAmount, uint256 stablecoinAmount)',
    ],
    lock: [
        // Updated ABI based on Lock.sol
        'function unlockTime() external view returns (uint256)',
        'function owner() external view returns (address)',
        'function withdraw() external',
        // Events
        'event Withdrawal(uint256 amount, uint256 when)',
    ],
};