// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryVsStorage {
    uint256[] public numbers;

    constructor() {
        numbers.push(1);
        numbers.push(2);
        numbers.push(3);
    }

    function modifyViaMemory() public {
        uint256[] memory temp = numbers;
        temp[0] = 999; // Does NOT persist
    }

    function modifyViaStorage() public {
        uint256[] storage temp = numbers;
        temp[0] = 999; // Persists
    }
}
