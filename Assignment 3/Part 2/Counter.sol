// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Counter is Ownable {
    uint256 private _value;

    event ValueUpdated(uint256 newValue);

    constructor() Ownable(msg.sender) {
        _value = 42;
    }

    function value() public view returns (uint256) {
        return _value;
    }

    function setValue(uint256 newValue) public onlyOwner {
        _value = newValue;
        emit ValueUpdated(newValue);
    }
}
