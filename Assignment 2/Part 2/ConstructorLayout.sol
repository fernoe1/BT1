// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ConstructorLayout {
    uint256 public a;
    uint256 public b;
    address public owner;

    constructor(uint256 _a, uint256 _b) {
        a = _a;
        b = _b;
        owner = msg.sender;
    }
}
