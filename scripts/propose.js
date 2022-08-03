const { ethers, network, deployments } = require("hardhat");
const {
  FUNCTION,
  VALUE,
  DESCRIPTION,
  VOTING_DELAY,
  proposalFile,
} = require("../helper-hardhat-config");
const { developmentChains } = require("../helper-hardhat-config");
const moveBlocks = require("../utils/moveBlocks");

const fs = require("fs");

const propose = async (func, args, description) => {
  await deployments.fixture(["all"]);
  const governor = await ethers.getContract("MyGovernor");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = await box.interface.encodeFunctionData(func, [
    args,
  ]);

  console.log(`Proposing ${func} on ${box.address} for value ${args}`);
  console.log(`Proposal Description: ${description}`);
  const propsalTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    description
  );

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const propsalReciept = await propsalTx.wait(1);
  const proposalId = propsalReciept.events[0].args.proposalId;

  let proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  console.log(proposals, "are these");
  proposals[network.config.chainId.toString()].push(proposalId.toString());

  fs.writeFileSync(proposalFile, JSON.stringify(proposals));
};

propose(FUNCTION, VALUE, DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = propose;
