import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();
  const tokenAddress = "0x5F88dDAa51d27E83075Af83C49C823DB28a7686e";
  const recipients = [
    "0x5ba28312193C12AD43611aA81602d7e56Df578Ed",
    "0x3E252b07c949f5065D59921e7C0fF6747745DEda"
  ];
  const amount = ethers.parseUnits("10", 18); // 10개씩 전송

  const token = await ethers.getContractAt("MPTContract", tokenAddress, sender);

  for (const recipient of recipients) {
    const tx = await token.transfer(recipient, amount);
    await tx.wait();
    console.log(`✅ ${recipient}에게 10개 전송 완료 (Tx: ${tx.hash})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 