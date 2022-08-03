const { MIN_DELAY } = require("../helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("--------------------------------");
  const args = [MIN_DELAY, [], []];
  log("Deploying TimeLock...");
  const Timelock = await deploy("Timelock", {
    log: true,
    from: deployer,
    args: args,
    waitConfirmations: process.env.waitConfirmations || 1,
  });

  log("--------------------------------");
};

module.exports.tags = ["all"];
