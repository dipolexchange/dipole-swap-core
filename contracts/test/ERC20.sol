pragma solidity =0.5.16;

import '../DipoleERC20.sol';

contract ERC20 is DipoleERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
