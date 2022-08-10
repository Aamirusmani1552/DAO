const {
  FUNCTION,
  VALUE,
  DESCRIPTION,
  VOTING_DELAY,
  proposalFile,
  developmentChains,
  VOTING_PERIOD,
  MIN_DELAY,
} = require("../helper-hardhat-config");
const { network, ethers, deployments } = require("hardhat");
const moveBlocks = require("../utils/moveBlocks");
const moveTime = require("../utils/moveTime");
const { assert } = require("chai");
const fs = require("fs");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Test for dao", () => {
      let box, governor, governanceToken, timeLock;
      beforeEach(async () => {
        await deployments.fixture("all");
        box = await ethers.getContract("Box");
        governor = await ethers.getContract("MyGovernor");
        timeLock = await ethers.getContract("Timelock");
        governanceToken = await ethers.getContract("AToken");
      });

      it("Should perform overall task of changing value", async () => {
        console.log("step 1: ");
        const encodedFunctionCall = await box.interface.encodeFunctionData(
          FUNCTION,
          [VALUE]
        );

        console.log(
          `Proposing ${FUNCTION} on ${box.address} for value ${VALUE}`
        );
        console.log(`Proposal Description: ${DESCRIPTION}`);
        const propsalTx = await governor.propose(
          [box.address],
          [0],
          [encodedFunctionCall],
          DESCRIPTION
        );

        if (developmentChains.includes(network.name)) {
          await moveBlocks(VOTING_DELAY + 1);
        }

        const propsalReciept = await propsalTx.wait(1);
        const proposalId = propsalReciept.events[0].args.proposalId;

        let proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
        console.log(proposals, "are these");
        proposals[network.config.chainId.toString()].push(
          proposalId.toString()
        );

        fs.writeFileSync(proposalFile, JSON.stringify(proposals));

        console.log("step 2");
        console.log("voting...");
        proposals = JSON.parse(fs.readFileSync(proposalFile, "utf-8"));
        const proposal = proposals[network.config.chainId.toString()][0];
        const Vote = 1;
        const reason = "because i like it";
        const voteTx = await governor.castVoteWithReason(
          proposal,
          Vote,
          reason
        );

        const voteResponse = await voteTx.wait(1);
        const returnedReason = voteResponse.events[0].args.reason;
        console.log(returnedReason);
        const state = await governor.state(proposal);

        console.log("Proposal state: ", state);

        if (developmentChains.includes(network.name)) {
          await moveBlocks(VOTING_PERIOD + 1);
        }

        console.log("step 3 and 4: ");
        console.log("Queueing...");
        const descriptionHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(DESCRIPTION)
        );
        const queueTx = await governor.queue(
          [box.address],
          [0],
          [encodedFunctionCall],
          descriptionHash
        );
        await queueTx.wait(1);

        if (developmentChains.includes(network.name)) {
          await moveTime(MIN_DELAY + 1);
          await moveBlocks(1);
        }
        console.log("Executing...");

        const executeTx = await governor.execute(
          [box.address],
          [0],
          [encodedFunctionCall],
          descriptionHash
        );
        await executeTx.wait(1);
        const boxNewValue = await box.getValue();
        console.log("box new value: ", boxNewValue.toString());
        assert.equal(boxNewValue.toString(), "77");
      });
    });
