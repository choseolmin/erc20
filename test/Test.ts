import { expect } from "chai";
import { ethers } from "hardhat";
import { GameToken } from "../typechain-types";

describe("GameToken 기본 소유 테스트", function () {
  let gameToken: GameToken;
  let owner: any;
  let ownerAddr: string;
  let other: any;

  const GOLD = 1;
  const POTION = 101;
  const SWORD = 5001;

  beforeEach(async function () {
    const [deployer, second] = await ethers.getSigners();
    owner = deployer;
    ownerAddr = deployer.address;
    other = second;

    const GameTokenFactory = await ethers.getContractFactory("GameToken");
    gameToken = await GameTokenFactory.deploy();
    await gameToken.waitForDeployment();
  });

  it("배포 직후 owner가 골드 1000개를 보유하고 있어야 함", async function () {
    const balance = await gameToken.balanceOf(ownerAddr, GOLD);
    expect(balance).to.equal(1000);
  });

  it("배포 직후 owner가 포션 1000개를 보유하고 있어야 함", async function () {
    const balance = await gameToken.balanceOf(ownerAddr, POTION);
    expect(balance).to.equal(1000);
  });

  it("배포 직후 owner가 전설의 검 1개를 보유하고 있어야 함", async function () {
    const balance = await gameToken.balanceOf(ownerAddr, SWORD);
    expect(balance).to.equal(1);
  });

  it("mint()로 다른 지갑에 포션 10개 지급", async () => {
    await gameToken.connect(owner).mint(other.address, POTION, 10);
    const bal = await gameToken.balanceOf(other.address, POTION);
    expect(bal).to.equal(10);
  });

  it("mintBatch()로 여러 아이템 동시에 지급", async () => {
    const ids = [GOLD, POTION];
    const amounts = [50, 20];
    await gameToken.connect(owner).mintBatch(other.address, ids, amounts);

    const gold = await gameToken.balanceOf(other.address, GOLD);
    const potion = await gameToken.balanceOf(other.address, POTION);
    expect(gold).to.equal(50);
    expect(potion).to.equal(20);
  });

  it("uri()로 메타데이터 경로 확인", async () => {
    const uri = await gameToken.uri(POTION);
    expect(uri).to.include("{id}"); // 수정: 템플릿 포함됨
    expect(uri).to.include("ipfs://");
  });

  it("safeTransferFrom()로 골드 100개 전송", async () => {
    await gameToken.connect(owner).safeTransferFrom(
      ownerAddr,
      other.address,
      GOLD,
      100,
      "0x"
    );
    const ownerBal = await gameToken.balanceOf(ownerAddr, GOLD);
    const otherBal = await gameToken.balanceOf(other.address, GOLD);
    expect(ownerBal).to.equal(900);
    expect(otherBal).to.equal(100);
  });

  it("safeBatchTransferFrom()로 골드+포션 동시 전송", async () => {
    const ids = [GOLD, POTION];
    const amounts = [200, 300];

    await gameToken.connect(owner).safeBatchTransferFrom(
      ownerAddr,
      other.address,
      ids,
      amounts,
      "0x"
    );

    const gold = await gameToken.balanceOf(other.address, GOLD);
    const potion = await gameToken.balanceOf(other.address, POTION);
    expect(gold).to.equal(200);
    expect(potion).to.equal(300);
  });
});
