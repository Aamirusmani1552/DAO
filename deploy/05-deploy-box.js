const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  log("--------------------------------");
  log("deploying Box....");

  const box = await deploy("Box", {
    log: true,
    args: [],
    from: deployer,
    waitConfimations: process.env.waitConfimations || 1,
  });

  const Timelock = await ethers.getContract("Timelock");

  const boxContract = await ethers.getContractAt("Box", box.address);
  const transferTx = await boxContract.transferOwnership(Timelock.address);
  await transferTx.wait(1);

  log("Successfully Done!");
  log("---------------------------------");
};

module.exports.tags = ["all", "box"];
