// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@account-abstraction/contracts/core/UserOperationLib.sol";

contract SmartAccount is BaseAccount {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    IEntryPoint private immutable _entryPoint;

    address public owner;

    constructor(IEntryPoint entryPoint_, address _owner) {
        _entryPoint = entryPoint_;
        owner = _owner;
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }

    function _validateSignature(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash
    ) internal view override returns (uint256 validationData) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (hash.recover(userOp.signature) != owner) {
            return 1; // Signature validation failed
        }
        return 0; // Signature valid
    }

    function _validateAndUpdateNonce(
        PackedUserOperation calldata userOp
    ) internal {
        require(nonce == userOp.nonce, "Invalid nonce");
        nonce++;
    }

    uint256 public nonce;

    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external override {
        require(msg.sender == owner, "Only owner");
        (bool success, ) = dest.call{value: value}(func);
        require(success, "Execution failed");
    }

    receive() external payable {}
}
