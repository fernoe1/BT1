// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GasArrayTest {
    uint256[] public data;

    // Version A
    function pushNaive(uint256 n) external {
        for (uint256 i = 0; i < n; i++) {
            data.push(i);
        }
    }

    // Version B
    function pushOptimized(uint256 n) external {
        uint256[] storage localData = data;
        for (uint256 i = 0; i < n; i++) {
            localData.push(i);
        }
    }

    // Version C
    function pushExtreme(uint256 n) external {
        uint256[] storage localData = data;
        uint256 len = localData.length;

        unchecked {
            for (uint256 i = 0; i < n; i++) {
                localData.push();
                localData[len + i] = i;
            }
        }
    }
}
