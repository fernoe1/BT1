// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    // Stored string variable
    string private greeting;

    // Event emitted when the greeting changes
    event GreetingUpdated(string oldGreeting, string newGreeting);

    // Constructor to initialize greeting
    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    // Public getter (view function)
    function getGreeting() public view returns (string memory) {
        return greeting;
    }

    // Public function to update greeting (state-changing)
    function updateGreeting(string memory _newGreeting) public {
        string memory old = greeting;
        greeting = _newGreeting;
        emit GreetingUpdated(old, _newGreeting); // Emit event on state change
    }

    // Private function (can only be called inside contract)
    function _privateHelper() private pure returns (string memory) {
        return "This is private!";
    }

    // Function to demonstrate calling a private function internally
    function showPrivateMessage() public pure returns (string memory) {
        return _privateHelper();
    }
}
