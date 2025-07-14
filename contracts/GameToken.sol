// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC1155, Ownable {
    
    uint256 public constant GOLD = 1; // ERC20
    uint256 public constant POTION = 101; // SFT
    uint256 public constant LEGENDARY_SWORD = 5001; // NFT

   constructor() ERC1155("ipfs://bafybeiabu2nejodfu3oritsozkkx2xaww3mhx6trpcxcqm4cp6xlzqilki/{id}.json") Ownable(msg.sender) {
    _mint(msg.sender, GOLD, 1000, "");
    _mint(msg.sender, POTION, 1000, "");
    _mint(msg.sender, LEGENDARY_SWORD, 1, "");
    }

    // 민트 함수 
    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, "");
    }

    // 배치 민트
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }

    // URI 설정 변경 함수
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
