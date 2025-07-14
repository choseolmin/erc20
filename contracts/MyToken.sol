// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    uint256 public deployedAt;
    address public owner;

    mapping(address => bool) public isLocked;

    constructor() ERC20("ChoToken", "Cho") {
        _mint(msg.sender, 712 * 10 ** decimals());
        deployedAt = block.timestamp;
        owner = msg.sender;
    }

    // 🔒 특정 사용자 사용 불가로 설정
    function lock(address user) public returns (bool) {
        require(msg.sender == owner, "Only owner can lock accounts");
        isLocked[user] = true;
        return true;
    }

    // 🔓 잠금 해제 
    function unlock(address user) public returns (bool) {
        require(msg.sender == owner, "Only owner can unlock accounts");
        isLocked[user] = false;
        return true;
    }

    // ✅ transfer 함수 오버라이드
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!isLocked[msg.sender], "Your account is locked");
        require(block.timestamp >= deployedAt + 5 minutes, "Token is locked for 5 minutes after deployment");

        return super.transfer(to, amount);
    }
}
