const MIN_DELAY = 3600;
const VOTING_DELAY = 1;
const VOTING_PERIOD = 5;
const QUORUM_PERCENTAGE = 4;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const FUNCTION = "changeValue";
const VALUE = 77;
const DESCRIPTION = "PROPSAL #1: SET CONTRACT VALUE 77";
const developmentChains = ["hardhat", "localhost"];
const proposalFile = "proposals.json";

module.exports = {
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  FUNCTION,
  VALUE,
  DESCRIPTION,
  developmentChains,
  proposalFile,
};
