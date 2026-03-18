// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VisibilityTest {

    function publicFunc() public pure returns (string memory) {
        return "public";
    }

    function externalFunc() external pure returns (string memory) {
        return "external";
    }

    function internalFunc() internal pure returns (string memory) {
        return "internal";
    }

    function privateFunc() private pure returns (string memory) {
        return "private";
    }

    // Call matrix demonstration
    function callAllInternal() public pure returns (string memory, string memory, string memory) {
        return (
            publicFunc(),
            internalFunc(),
            privateFunc()
        );
    }

    function callExternal() public view returns (string memory) {
        // Must use `this`
        return this.externalFunc();
    }
}
