const { ethers } = require("hardhat");
const {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const Timelock = await get("Timelock");
  const AToken = await get("AToken");

  log("--------------------------------");
  const args = [
    AToken.address,
    Timelock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];
  log("Deploying MyGovernor...");
  const governace = await deploy("MyGovernor", {
    log: true,
    from: deployer,
    args: args,
    waitConfirmations: process.env.waitConfirmations || 1,
  });

  log("--------------------------------");
};

module.exports.tags = ["all"];
