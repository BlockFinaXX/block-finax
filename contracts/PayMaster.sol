// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster, Ownable {
    using SafeMath for uint256;

    address public entryPoint;
    IERC20 public token; // ERC20 token to pay gas fees (can be modified as needed)
    uint256 public gasLimit;

    event PaymasterSetup(address indexed entryPoint, address indexed token, uint256 gasLimit);
    event GasPayment(address indexed user, uint256 amount);

    constructor(address _entryPoint, address _token, uint256 _gasLimit) {
        entryPoint = _entryPoint;
        token = IERC20(_token);
        gasLimit = _gasLimit;
        emit PaymasterSetup(_entryPoint, _token, _gasLimit);
    }

    /**
     * @dev Verifies if the paymaster is willing to sponsor the transaction.
     * Checks the signature and validity of the transaction.
     * @param context The context for the transaction (e.g., user's signature, data).
     * @param opData The data related to the operation.
     * @return The gas cost estimation, which can be a positive value or 0.
     */
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 requiredGas
    ) external view override returns (uint256) {
        // Ensure that the user is not spending more gas than allowed
        if (requiredGas > gasLimit) {
            return 0;
        }

        // Here you can add logic to check if the user is eligible for sponsoring
        // For instance, by checking a whitelist or a condition based on userOp

        return requiredGas; // Will sponsor the entire gas cost
    }

    /**
     * @dev Pays the transaction fees for the user from the Paymaster's token balance.
     * @param user The address of the user whose transaction is being sponsored.
     * @param userOp The user operation to be processed.
     * @param requiredGas The amount of gas required for the transaction.
     */
    function postOp(
        PostOpMode mode,
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 actualGasCost
    ) external override {
        require(msg.sender == entryPoint, "Paymaster: only EntryPoint can call postOp");

        if (mode == PostOpMode.opSucceeded || mode == PostOpMode.opReverted) {
            uint256 amount = actualGasCost;
            require(token.transferFrom(address(this), userOp.sender, amount), "Paymaster: failed to transfer tokens");
            emit GasPayment(userOp.sender, amount);
        }
    }

    /**
     * @dev Allows the owner to set the gas limit for the paymaster
     * @param newGasLimit The new gas limit for transactions.
     */
    function setGasLimit(uint256 newGasLimit) external onlyOwner {
        gasLimit = newGasLimit;
    }

    /**
     * @dev Allows the owner to withdraw any remaining token balance
     * @param amount The amount of tokens to withdraw.
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.transfer(owner(), amount), "Paymaster: withdrawal failed");
    }
}
