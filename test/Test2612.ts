import { ethers } from "hardhat";
import { ERC2612Contract__factory } from "../typechain-types";
import { expect } from "chai";
import { Signature, MaxUint256 } from "ethers";

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

describe("ERC2612Contract - permit() on deployed contract", function () {
    it("should set allowance via permit", async () => {
        const [owner, spender] = await ethers.getSigners();
        // 컨트랙트 직접 배포
        const ERC2612Factory = await ethers.getContractFactory("ERC2612Contract");
        const token = await ERC2612Factory.deploy();
        await token.waitForDeployment();
        const address = await token.getAddress();

        const chainId = BigInt((await ethers.provider.getNetwork()).chainId);
        const value = 1000n;
        const deadline = MaxUint256;
        const nonce = await token.nonces(owner.address);

        const { v, r, s } = await signPermit(
            owner, spender, value, nonce, deadline,
            address, "MyToken2612", "1", chainId
        );

        await token.permit(owner.address, spender.address, value, deadline, v, r, s);

        expect(await token.allowance(owner.address, spender.address)).to.equal(value);
    });
});
