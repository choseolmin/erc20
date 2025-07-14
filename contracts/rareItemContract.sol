// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract rareItemContract is ERC721, Ownable {
    uint256 public currentTokenId = 5001;

    constructor() ERC721("LegendarySword", "LSWORD")Ownable(msg.sender) {}

    function mint(address to) public onlyOwner {
        _safeMint(to, currentTokenId);
        currentTokenId++;
    }
}
