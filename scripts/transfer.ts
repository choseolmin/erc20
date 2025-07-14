import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    const tokenAddress = "0x5Dc994C7506e311227248Ed74d2b83b479584464"; // 배포된 ERC2612 주소
    const myWalletAddress = "0x3E252b07c949f5065D59921e7C0fF6747745DEda"; // 받을 지갑 주소

    const token = await ethers.getContractAt("ERC2612Contract", tokenAddress);

    const amount = ethers.parseUnits("10", 18); // 10개 전송
    const balanceBefore = await token.balanceOf(myWalletAddress);
    console.log("💰 기존 잔액:", balanceBefore.toString());

    const tx = await token.transfer(myWalletAddress, amount);
    await tx.wait();

    const balanceAfter = await token.balanceOf(myWalletAddress);
    console.log("✅ 전송 완료 후 잔액:", balanceAfter.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
