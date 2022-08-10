const { ethers, network, deployments } = require("hardhat");
const {
  VOTING_PERIOD,
  VOTING_DELAY,
  proposalFile,
} = require("../helper-hardhat-config");
const { developmentChains } = require("../helper-hardhat-config");
const moveBlocks = require("../utils/moveBlocks");
const fs = require("fs");

const index = 0;

async function vote() {
  if (developmentChains.includes(network.name)) {
    await deployments.fixture("all");
  }
  const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf-8"));
  const proposal = proposals[network.config.chainId.toString()][index];
  const Vote = 1;
  const reason = "because i like it";
  const governor = await ethers.getContract("MyGovernor");
  console.log(proposal);

  const voteTx = await governor.castVoteWithReason(proposal, Vote, reason);

  const voteResponse = await voteTx.wait(1);
  const returnedReason = voteResponse.events[0].args.reason;
  console.log(returnedReason);
  const state = await governor.state(proposal);

  console.log("Proposal state: ", state);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
}

vote()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
