const { ethers } = require("hardhat");
const { ADDRESS_ZERO } = require("../helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const Timelock = await ethers.getContract("Timelock", deployer);
  const governor = await ethers.getContract("MyGovernor", deployer);

  log("--------------------------------");
  log("setting up roles!!!");

  const adminRole = await Timelock.TIMELOCK_ADMIN_ROLE();
  const proposerRole = await Timelock.PROPOSER_ROLE();
  const executorRole = await Timelock.EXECUTOR_ROLE();

  const grantRoleTx = await Timelock.grantRole(proposerRole, governor.address);
  await grantRoleTx.wait(1);

  const executorRoleTx = await Timelock.grantRole(executorRole, ADDRESS_ZERO);
  await executorRoleTx.wait(1);

  const revokeRoleTx = await Timelock.revokeRole(adminRole, deployer);
  await revokeRoleTx.wait(1);

  log("Setup successfully!");
  log("---------------------------------");
};

module.exports.tags = ["all", "setRole"];
