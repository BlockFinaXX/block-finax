// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./SmartAccount.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

contract SmartAccountFactory {
    // IEntryPoint public immutable entryPoint;
    IEntryPoint private immutable _entryPoint;

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }
    
    address public immutable walletImplementation;

    event WalletDeployed(address wallet, address owner);

    constructor(IEntryPoint _entryPoint) {
        entryPoint = _entryPoint;

        SmartAccount wallet = new SmartAccount(_entryPoint, address(this));
        walletImplementation = address(wallet);
    }

    function getAddress(address owner, uint256 salt) public view returns (address predicted) {
        bytes32 bytecodeHash = keccak256(getBytecode(owner));
        return address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            bytes32(salt),
            bytecodeHash
        )))));
    }

    function createWallet(address owner, uint256 salt) external returns (address wallet) {
        bytes memory bytecode = getBytecode(owner);
        assembly {
            wallet := create2(0, add(bytecode, 32), mload(bytecode), salt)
            if iszero(extcodesize(wallet)) {
                revert(0, 0)
            }
        }
        emit WalletDeployed(wallet, owner);
    }

    function getBytecode(address owner) internal view returns (bytes memory) {
        return abi.encodePacked(
            type(SmartAccount).creationCode,
            abi.encode(entryPoint, owner)
        );
    }
}
