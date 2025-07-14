import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("MPTContract");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
