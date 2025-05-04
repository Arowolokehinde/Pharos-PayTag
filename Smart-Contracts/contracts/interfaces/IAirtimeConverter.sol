// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAirtimeConverter
 * @dev Interface for converting RealPay StableCoins to airtime or other services
 */
interface IAirtimeConverter {
    /**
     * @dev Struct for redemption request details
     */
    struct RedemptionRequest {
        uint256 requestId;       // Unique identifier for the request
        address requester;       // Address that made the request
        string serviceType;      // Type of service (e.g., "airtime", "data", "grocery")
        string serviceProvider;  // Provider of the service (e.g., "Vodacom", "MTN")
        string recipientId;      // Recipient identifier (e.g., phone number)
        uint256 amount;          // Amount in RPSC tokens
        uint256 requestTime;     // Timestamp of the request
        bool fulfilled;          // Whether the request has been fulfilled
    }

    /**
     * @dev Event emitted when a new redemption request is created
     */
    event RedemptionRequested(
        uint256 indexed requestId,
        address indexed requester,
        string serviceType,
        string recipientId,
        uint256 amount
    );
    
    /**
     * @dev Event emitted when a redemption request is fulfilled
     */
    event RedemptionFulfilled(uint256 indexed requestId, uint256 fulfillmentTime);

    /**
     * @dev Creates a request to convert RPSC tokens to airtime
     * @param phoneNumber The phone number to send airtime to
     * @param provider The airtime provider
     * @param amount The amount of RPSC tokens to convert
     * @return requestId The ID of the created request
     */
    function requestAirtime(
        string calldata phoneNumber,
        string calldata provider,
        uint256 amount
    ) external returns (uint256 requestId);
    
    /**
     * @dev Creates a request to convert RPSC tokens to any supported service
     * @param serviceType Type of service (e.g., "airtime", "data", "grocery")
     * @param serviceProvider Provider of the service
     * @param recipientId Recipient identifier (e.g., phone number, account)
     * @param amount The amount of RPSC tokens to convert
     * @return requestId The ID of the created request
     */
    function requestService(
        string calldata serviceType,
        string calldata serviceProvider,
        string calldata recipientId,
        uint256 amount
    ) external returns (uint256 requestId);
    
    /**
     * @dev Marks a redemption request as fulfilled (callable by authorized fulfiller)
     * @param requestId The ID of the request to mark as fulfilled
     * @return success Whether the update was successful
     */
    function fulfillRequest(uint256 requestId) external returns (bool);
    
    /**
     * @dev Gets all redemption requests made by an address
     * @param requester The address to get requests for
     * @return List of redemption request IDs
     */
    function getRequestsByAddress(address requester) external view returns (uint256[] memory);
    
    /**
     * @dev Gets details for a specific redemption request
     * @param requestId The ID of the request
     * @return The RedemptionRequest struct containing request details
     */
    function getRequestDetails(uint256 requestId) external view returns (RedemptionRequest memory);
}