// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
pragma solidity ^0.8.28;

contract ERC2612Contract is ERC20Permit {
    constructor() ERC20("MyToken2612", "MTK2") ERC20Permit("MyToken2612") {
        _mint(msg.sender, 1000000 * 1e18);
    }
}
