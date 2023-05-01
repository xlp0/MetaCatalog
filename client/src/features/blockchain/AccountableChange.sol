pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

contract AccountableChange {
    address public contractOwner;
    mapping(address => bool) authorizedAccounts;

    event ChangeSubmitted(address indexed sender, string data);
    event AuthorizationChanged(address indexed account, bool authorized);

    constructor() {
        contractOwner = msg.sender;
        authorizedAccounts[msg.sender] = true; 
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contract owner can perform this action.");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedAccounts[msg.sender], "Only authorized accounts can perform this action.");
        _;
    }

    function authorizeAccount(address _account) public onlyOwner {
        authorizedAccounts[_account] = true;
        emit AuthorizationChanged(_account, true);
    }

    function revokeAuthorization(address _account) public onlyOwner {
        authorizedAccounts[_account] = false;
        emit AuthorizationChanged(_account, false);
    }

    function submitChange(string memory _data) public onlyAuthorized {
        emit ChangeSubmitted(msg.sender, _data);
    }
}
