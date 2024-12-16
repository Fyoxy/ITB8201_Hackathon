// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
 
contract Bank {
    
    address public owner;
    
    struct User {
        uint256 ethBalance; // ETH balance
    }
 
    address[] private foundations = [
        0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB, // Red Cross Foundation
        0x583031D1113aD414F02576BD6afaBfb302140225, // Nature Foundation
        0xdD870fA1b7C4700F2BD7f44238821C26f7392148  // Homeless Foundation
    ];
 
    mapping(address => uint256) private foundationCoefficients;  // Coefficient for each foundation
    mapping(address => uint256) private foundationWithdrawn;    // Amount withdrawn by each foundation
    mapping(address => uint256) private foundationDeposited;    // Amount allocated to each foundation
 
    mapping(address => User) public users;
    address[] private userAddresses;
 
    event DepositETH(address indexed user, uint256 amount);
    event Withdrawal(address indexed foundation, uint256 amount);
    event TransferETH(address indexed from, address indexed to, uint256 amount);
    event CoefficientSet(address indexed foundation, uint256 coefficient);
 
    uint256 public totalDeposited;
 
    modifier onlyOwner() {
        require(msg.sender == owner, "Only for the bank owner");
        _;
    }
 
    modifier onlyUser() {
        require(users[msg.sender].ethBalance > 0, "Only for bank users who have balance");
        _;
    }
 
    constructor() {
        owner = msg.sender;
    }
 
    function setFoundationCoefficient(address foundationAddress, uint256 coefficient) public onlyOwner {
        require(coefficient <= 100, "Coefficient too large");
        require(isValidFoundation(foundationAddress), "Invalid foundation");
 
        foundationCoefficients[foundationAddress] = coefficient;
 
        emit CoefficientSet(foundationAddress, coefficient);
    }
 
    function getFoundationCoefficient(address foundationAddress) public view returns (uint256) {
        require(isValidFoundation(foundationAddress), "Invalid foundation");
        return foundationCoefficients[foundationAddress];
    }
 
    function isValidFoundation(address foundationAddress) private view returns (bool) {
        for (uint256 i = 0; i < foundations.length; i++) {
            if (foundations[i] == foundationAddress) {
                return true;
            }
        }
        return false;
    }
 
    // Update: Deposit ETH and immediately calculate foundation's share based on their coefficient
    function depositETH() external payable {
        require(msg.value > 0, "Depositing value has to be greater than 0");
        users[msg.sender].ethBalance += msg.value;
        totalDeposited += msg.value;
 
        if (users[msg.sender].ethBalance == msg.value) {
            userAddresses.push(msg.sender);
        }
 
        // Allocate the deposit to each foundation based on their coefficient
        for (uint256 i = 0; i < foundations.length; i++) {
            address foundation = foundations[i];
            uint256 coefficient = foundationCoefficients[foundation];
            uint256 allocation = (msg.value * coefficient) / 100;
 
            foundationDeposited[foundation] += allocation;
        }
 
        emit DepositETH(msg.sender, msg.value);
    }
 
    // Foundation withdraws based on its coefficient of total deposited funds
    function withdraw() external {
        require(isValidFoundation(msg.sender), "Caller is not a valid foundation");
 
        uint256 coefficient = foundationCoefficients[msg.sender];
        require(coefficient > 0, "No coefficient set for this foundation");
 
        // Foundation's share is already calculated during deposit
        uint256 maxWithdrawAmount = foundationDeposited[msg.sender];
        uint256 alreadyWithdrawn = foundationWithdrawn[msg.sender];
        uint256 remainingAmount = maxWithdrawAmount - alreadyWithdrawn;
 
        require(remainingAmount > 0, "No remaining funds to withdraw");
        require(address(this).balance >= remainingAmount, "Insufficient contract balance");
 
        // Transfer the remaining amount
        (bool success, ) = msg.sender.call{value: remainingAmount}("");
        require(success, "Withdrawal failed");
 
        foundationWithdrawn[msg.sender] += remainingAmount; // Update the withdrawn amount
 
        emit Withdrawal(msg.sender, remainingAmount);
    }
 
    function transferETH(address to, uint256 amount) external onlyUser {
        require(users[msg.sender].ethBalance >= amount, "Insufficient funds");
 
        users[msg.sender].ethBalance -= amount;
        users[to].ethBalance += amount;
 
        if (users[msg.sender].ethBalance == 0) {
            _removeUser(msg.sender);
        }
 
        emit TransferETH(msg.sender, to, amount);
    }
 
    function _removeUser(address userAddress) internal {
        uint256 userCount = userAddresses.length;
 
        for (uint256 i = 0; i < userCount; i++) {
            if (userAddresses[i] == userAddress) {
                userAddresses[i] = userAddresses[userCount - 1];
                userAddresses.pop();
                break;
            }
        }
    }
}
