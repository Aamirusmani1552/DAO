//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
  uint256 private s_number;

  constructor() {
    s_number = 0;
  }

  function changeValue(uint256 newValue) public {
    s_number = newValue;
  }

  function getValue() public view returns (uint256) {
    return s_number;
  }
}
