// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Timelock is TimelockController {
  constructor(
    uint256 _minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(_minDelay, proposers, executors) {}
}
