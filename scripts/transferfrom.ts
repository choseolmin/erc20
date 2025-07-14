import { ethers } from "hardhat";
import { Wallet, Signature, MaxUint256 } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function signPermit(
    owner: any,
    spender: any,
    value: bigint,
    nonce: bigint,
    deadline: bigint,
    tokenAddress: string,
    name: string,
    version: string,
    chainId: bigint
) {
    const domain = {
        name,
        version,
        chainId,
        verifyingContract: tokenAddress,
    };

    const types = {
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ],
    };

    const message = {
        owner: owner.address,
        spender: spender.address,
        value,
        nonce,
        deadline,
    };

    const signature = await owner.signTypedData(domain, types, message);
    const sig = Signature.from(signature);

    return { v: sig.v, r: sig.r, s: sig.s };
}

async function main() {
    const provider = ethers.provider;

    const a = new Wallet(process.env.A_PRIVATE_KEY!, provider);
    const b = new Wallet(process.env.B_PRIVATE_KEY!, provider);
    const cAddress = process.env.C_ADDRESS!;
    const tokenAddress = process.env.TOKEN_ADDRESS!;

    const token = await ethers.getContractAt("ERC2612Contract", tokenAddress, b);

    const chainId = BigInt((await ethers.provider.getNetwork()).chainId);
    const permitValue = ethers.parseUnits("100", 18); // 100개 허용
    const transferValue = ethers.parseUnits("1", 18); // 1개 전송
    const deadline = MaxUint256;
    const nonce = await token.nonces(a.address);

    console.log("✅ A가 오프체인에서 permit 서명 (100개 허용)");
    const { v, r, s } = await signPermit(
        a, b, permitValue, nonce, deadline,
        tokenAddress, "MyToken2612", "1", chainId
    );

    console.log("✅ B가 on-chain으로 permit 실행 (가스비 냄)");
    const permitTx = await token.permit(a.address, b.address, permitValue, deadline, v, r, s);
    console.log("permit 트랜잭션 해시:", permitTx.hash);

    console.log("✅ B가 A의 토큰을 C로 1개만 전송");
    const transferTx = await token.transferFrom(a.address, ethers.getAddress(cAddress), transferValue);
    console.log("transferFrom 트랜잭션 해시:", transferTx.hash);

    const cBalance = await token.balanceOf(cAddress);
    const allowanceLeft = await token.allowance(a.address, b.address);

    console.log("C의 최종 토큰 잔액:", ethers.formatUnits(cBalance, 18));
    console.log("B가 남은 allowance:", ethers.formatUnits(allowanceLeft, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
