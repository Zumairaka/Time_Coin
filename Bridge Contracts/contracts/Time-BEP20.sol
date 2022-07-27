// A dummy token created to check the flow for the bridge not to be used in production

pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TimeToken is ERC20{
    address public admin;
    constructor() ERC20('Time', 'TIME'){
        _mint(msg.sender,10000 * 10**18);
        admin=msg.sender;
    }
}