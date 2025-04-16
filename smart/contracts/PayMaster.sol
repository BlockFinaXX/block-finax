// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@account-abstraction/contracts/interfaces/IPaymaster.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@account-abstraction/contracts/core/UserOperationLib.sol";




/**
 * @title Sponsored Paymaster
 * @notice This contract pays gas fees on behalf of users using its own ERC20 token balance.
 */
contract Paymaster is IPaymaster, Ownable {
    IEntryPoint public immutable entryPoint;
    uint256 public gasLimit;

    event PaymasterSetup(address indexed entryPoint, address indexed token, uint256 gasLimit);
    event GasPayment(address indexed user, uint256 amount);

    constructor(address _entryPoint, uint256 _gasLimit,  address initialOwner) Ownable(initialOwner)  {
        
        require(_entryPoint != address(0), "Invalid EntryPoint");
        entryPoint = IEntryPoint(_entryPoint);
        gasLimit = _gasLimit;
        emit PaymasterSetup(_entryPoint, address(0), _gasLimit);
    }

    /**
     * @notice Validates whether this paymaster will sponsor the given UserOperation.
     * @dev This version simply checks if gas required is within allowed limits.
     */

    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32, // userOpHash
        uint256 requiredPreFund
    ) external view override returns (bytes memory context, uint256 validationData) {
        require(msg.sender == address(entryPoint), "Unauthorized caller");
    
        // Only sponsor if this is a wallet creation (initCode is non-empty)
        if (userOp.initCode.length == 0) {
            return ("", 1); // don't sponsor, return non-zero validationData
        }
    
        // Optional: check that requiredPreFund isn't crazy high
        if (requiredPreFund > gasLimit) {
            return ("", 1);
        }
    
        return ("", 0); // Sponsor this operation
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
            (bool success, ) = payable(msg.sender).call{value: actualGasCost}("");
            require(success, "Native token transfer failed");

        }

        emit GasPayment(msg.sender, actualGasCost);
    }

    /**
     * @notice Updates the gas limit allowed for sponsored operations.
     */
    function setGasLimit(uint256 newGasLimit) external onlyOwner {
        gasLimit = newGasLimit;
    }

    receive() external payable {}
    fallback() external payable {}
}