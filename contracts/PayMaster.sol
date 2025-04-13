// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@account-abstraction/contracts/interfaces/IPaymaster.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@account-abstraction/contracts/core/UserOperationLib.sol";




/**
 * @title Sponsored Paymaster
 * @notice This contract pays gas fees on behalf of users using its own ERC20 token balance.
 */
contract Paymaster is IPaymaster, Ownable {
    IEntryPoint public immutable entryPoint;
    IERC20 public immutable token;
    uint256 public gasLimit;

    event PaymasterSetup(address indexed entryPoint, address indexed token, uint256 gasLimit);
    event GasPayment(address indexed user, uint256 amount);

    constructor(address _entryPoint, address _token, uint256 _gasLimit,  address initialOwner) Ownable(initialOwner)  {
        
        require(_entryPoint != address(0), "Invalid EntryPoint");
        require(_token != address(0), "Invalid token");
        entryPoint = IEntryPoint(_entryPoint);
        token = IERC20(_token);
        gasLimit = _gasLimit;
        emit PaymasterSetup(_entryPoint, _token, _gasLimit);
    }

    /**
     * @notice Validates whether this paymaster will sponsor the given UserOperation.
     * @dev This version simply checks if gas required is within allowed limits.
     */
    function validatePaymasterUserOp(
        PackedUserOperation calldata /*userOp*/,
        bytes32, // userOpHash (can be used in future enhancements)
        uint256 requiredPreFund
    ) external view override returns (bytes memory context, uint256 validationData) {
        require(msg.sender == address(entryPoint), "Unauthorized caller");

        if (requiredPreFund > gasLimit) {
            return ("", 1); // 1 signals failure (non-zero validationData)
        }

        return ("", 0); // context is unused here, and 0 means valid
    }

    /**
     * @notice Pays the gas fee after the operation completes.
     * @dev Called only by EntryPoint.
     */
    function postOp(
        PostOpMode mode,
        bytes calldata /*context */,
        uint256 actualGasCost,
       uint256 /* actualUserOpFeePerGas */
    ) external override {
        require(msg.sender == address(entryPoint), "Only EntryPoint can call postOp");

        if (mode == PostOpMode.opSucceeded || mode == PostOpMode.opReverted) {
            require(token.transfer(msg.sender, actualGasCost), "Token transfer failed");
        }

        emit GasPayment(msg.sender, actualGasCost);
    }

    /**
     * @notice Updates the gas limit allowed for sponsored operations.
     */
    function setGasLimit(uint256 newGasLimit) external onlyOwner {
        gasLimit = newGasLimit;
    }

    /**
     * @notice Allows the owner to withdraw tokens from the Paymaster.
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.transfer(owner(), amount), "Token withdrawal failed");
    }

    /**
     * @notice Get balance of tokens held by this Paymaster.
     */
    function getTokenBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    receive() external payable {}
    fallback() external payable {}
}