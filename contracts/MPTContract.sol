// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MPTContract is ERC20Permit {
    constructor() ERC20("MyPermitToken", "MPT") ERC20Permit("MyPermitToken") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
