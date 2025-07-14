// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contract1155 {
    uint256 public constant GOLD = 1;
    uint256 public constant SILVER = 2;
    uint256 public constant HEALTH_POTION = 101; // SFT
    uint256 public constant LEGENDARY_SWORD = 5001; // NFT

    mapping(address => mapping(uint256 => uint256)) public TokenBalance; // 주소 -> 토큰ID -> 잔액
    mapping(address => mapping(address => bool)) public isApprovedForAll; // 오너 -> 승인받은 주소 -> 승인 여부

    constructor() {}

    // ✅ 단일 민트
    function mint(address owner, uint tokenID, uint amount) public returns (bool) {
        require(msg.sender == owner, "Only owner can mint");
        require(_isValidToken(tokenID), "Invalid token ID");
        require(amount > 0, "Amount must be greater than zero");

        TokenBalance[owner][tokenID] += amount;
        return true;
    }

    // ✅ 배치 민트
    function mintBatch(address owner, uint[] memory tokenIDs, uint[] memory amounts) public returns (bool) {
        require(msg.sender == owner, "Only owner can mint");
        require(tokenIDs.length == amounts.length, "Array lengths mismatch");

        for (uint i = 0; i < tokenIDs.length; i++) {
            require(_isValidToken(tokenIDs[i]), "Invalid token ID");
            require(amounts[i] > 0, "Amount must be greater than zero");
            TokenBalance[owner][tokenIDs[i]] += amounts[i];
        }

        return true;
    }

    // ✅ 잔액 조회
    function balanceOf(address account, uint tokenID) public view returns (uint256) {
        require(_isValidToken(tokenID), "Invalid token ID");
        require(account != address(0), "Invalid address");

        return TokenBalance[account][tokenID];
    }

    // ✅ 배치 잔액 조회
    function balanceOfBatch(address account, uint[] memory tokenIDs) public view returns (uint[] memory) {
        require(account != address(0), "Invalid address");

        uint[] memory balances = new uint[](tokenIDs.length);
        for (uint i = 0; i < tokenIDs.length; i++) {
            require(_isValidToken(tokenIDs[i]), "Invalid token ID");
            balances[i] = TokenBalance[account][tokenIDs[i]];
        }

        return balances;
    }

    // ✅ 단일 전송
    function transfer(address from, address to, uint tokenID, uint256 amount) public returns (bool) {
        require(to != address(0), "Invalid recipient");
        require(
            msg.sender == from || isApprovedForAll[from][msg.sender],
            "Caller is not owner nor approved"
        );
        require(TokenBalance[from][tokenID] >= amount, "Insufficient balance");

        TokenBalance[from][tokenID] -= amount;
        TokenBalance[to][tokenID] += amount;

        return true;
    }

    // ✅ 배치 전송
    function batchTransfer(address from, address to, uint[] memory tokenIDs, uint256[] memory amounts) public returns (bool) {
        require(to != address(0), "Invalid recipient");
        require(tokenIDs.length == amounts.length, "Array lengths mismatch");
        require(
            msg.sender == from || isApprovedForAll[from][msg.sender],
            "Caller is not owner nor approved"
        );

        for (uint i = 0; i < tokenIDs.length; i++) {
            uint tokenID = tokenIDs[i];
            uint amount = amounts[i];

            require(_isValidToken(tokenID), "Invalid token ID");
            require(TokenBalance[from][tokenID] >= amount, "Insufficient balance");

            TokenBalance[from][tokenID] -= amount;
            TokenBalance[to][tokenID] += amount;
        }

        return true;
    }

    // ✅ 승인 설정 (전체 승인)
    function setApprovalForAll(address operator, bool approved) public returns (bool) {
        require(operator != msg.sender, "Cannot approve self");
        isApprovedForAll[msg.sender][operator] = approved;
        return true;
    }

    // ✅ 전송 with 승인 검사
    function transferFrom(address from, address to, uint tokenID, uint256 amount) public returns (bool) {
        return transfer(from, to, tokenID, amount);
    }

    function batchTransferFrom(address from, address to, uint[] memory tokenIDs, uint256[] memory amounts) public returns (bool) {
        return batchTransfer(from, to, tokenIDs, amounts);
    }

    // ✅ 내부 유효 토큰 체크 함수
    function _isValidToken(uint tokenID) internal pure returns (bool) {
        return (
            tokenID == GOLD ||
            tokenID == SILVER ||
            tokenID == HEALTH_POTION ||
            tokenID == LEGENDARY_SWORD
        );
    }
}
