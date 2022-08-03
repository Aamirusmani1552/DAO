const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("--------------------------------");
  log("Deploying governanceToken...");
  const governanceToken = await deploy("AToken", {
    log: true,
    from: deployer,
    args: [],
    waitConfirmations: process.env.waitConfirmations || 1,
  });

  log("--------------------------------");
  log(`delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer);
  log("delegated!");
};

const delegate = async (governanceTokenAddress, delegatee) => {
  const governanceToken = await ethers.getContractAt(
    "AToken",
    governanceTokenAddress
  );
  const transactionResponse = await governanceToken.delegate(delegatee);
  await transactionResponse.wait(1);
  console.log("checkpoints: ", await governanceToken.numCheckpoints(delegatee));
};

module.exports.tags = ["all"];
