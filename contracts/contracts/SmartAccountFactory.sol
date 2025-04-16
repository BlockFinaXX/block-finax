// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./SmartAccount.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

contract SmartAccountFactory {
    IEntryPoint private immutable _entryPoint;

    function entryPoint() public view returns (IEntryPoint) {
        return _entryPoint;
    }

    address public immutable walletImplementation;

    event WalletDeployed(address wallet, address owner);

    constructor(IEntryPoint entryPoint_) {
        _entryPoint = entryPoint_;

        SmartAccount wallet = new SmartAccount(entryPoint_, address(this));
        walletImplementation = address(wallet);
    }

    function getAddress(
        address owner,
        uint256 salt
    ) public view returns (address predicted) {
        bytes32 bytecodeHash = keccak256(getBytecode(owner));
        return
            address(
                uint160(
                    uint(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xff),
                                address(this),
                                bytes32(salt),
                                bytecodeHash
                            )
                        )
                    )
                )
            );
    }

    function createWallet(
        address owner,
        uint256 salt
    ) external returns (address wallet) {
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
        return
            abi.encodePacked(
                type(SmartAccount).creationCode,
                abi.encode(_entryPoint, owner)
            );
    }
}
