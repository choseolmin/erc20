import { expect } from 'chai';
import { ethers, network } from 'hardhat';

describe('Erc20 기능 검사', function () {
  let token: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it('balanceOf 검사', async function () {
    const result = await token.balanceOf(owner.address);
    const balance = ethers.formatEther(result);
    console.log('✅ owner 잔액:', balance, 'ETH');
    expect(Number(balance) > 0).to.be.true;
  });

  it('transfer 검사 : owner -> addr1', async function () {
    // 360초(6분) 시간 증가
    await network.provider.send("evm_increaseTime", [360]);
    await network.provider.send("evm_mine");

    // 현재 블록 타임스탬프 구하기
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const now = block?.timestamp ?? 0;

    // 컨트랙트 배포 시각 구하기
    const deployedAt = await token.deployedAt();

    // 경과 시간(초) 계산
    const elapsed = Number(now) - Number(deployedAt);
    console.log(`⏰ 컨트랙트 배포 후 경과 시간: ${elapsed}초`);

    const ownerBalanceBefore = BigInt(await token.balanceOf(owner.address));
    const addr1BalanceBefore = BigInt(await token.balanceOf(addr1.address));
    console.log('🟡 이전 owner 잔액:', ethers.formatEther(ownerBalanceBefore), 'ETH');
    console.log('🟡 이전 addr1 잔액:', ethers.formatEther(addr1BalanceBefore), 'ETH');

    await token.transfer(addr1.address, ethers.parseEther("1"));

    const ownerBalanceAfter = BigInt(await token.balanceOf(owner.address));
    const addr1BalanceAfter = BigInt(await token.balanceOf(addr1.address));
    console.log('🟢 이후 owner 잔액:', ethers.formatEther(ownerBalanceAfter), 'ETH');
    console.log('🟢 이후 addr1 잔액:', ethers.formatEther(addr1BalanceAfter), 'ETH');

    expect(addr1BalanceAfter).to.equal(addr1BalanceBefore + ethers.parseEther("1"));
  });

  it('approve, allowance, transferFrom 검사', async function () {
    const amount = ethers.parseEther("3");
    await token.connect(owner).approve(addr1.address, amount);
    console.log('✅ approve 금액:', ethers.formatEther(amount), 'ETH');

    const allowed = await token.allowance(owner.address, addr1.address);
    console.log('🟡 allowance 금액:', ethers.formatEther(allowed), 'ETH');
    expect(allowed).to.equal(amount);

    const ownerBalanceBefore = BigInt(await token.balanceOf(owner.address));
    const addr2BalanceBefore = BigInt(await token.balanceOf(addr2.address));
    console.log('🟡 이전 owner 잔액:', ethers.formatEther(ownerBalanceBefore), 'ETH');
    console.log('🟡 이전 addr2 잔액:', ethers.formatEther(addr2BalanceBefore), 'ETH');

    await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);

    const ownerBalanceAfter = BigInt(await token.balanceOf(owner.address));
    const addr2BalanceAfter = BigInt(await token.balanceOf(addr2.address));
    console.log('🟢 이후 owner 잔액:', ethers.formatEther(ownerBalanceAfter), 'ETH');
    console.log('🟢 이후 addr2 잔액:', ethers.formatEther(addr2BalanceAfter), 'ETH');

    const remain = await token.allowance(owner.address, addr1.address);
    console.log('🟢 transferFrom 후 allowance 잔량:', ethers.formatEther(remain), 'ETH');

    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - amount);
    expect(addr2BalanceAfter).to.equal(addr2BalanceBefore + amount);
    expect(remain).to.equal(0);
  });

  it('🔒 5분 제한: 배포 직후 transfer 불가', async function () {
    console.log('⏳ 배포 직후 transfer 시도 → 실패 ');
    await expect(
      token.connect(owner).transfer(addr1.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Token is locked for 5 minutes after deployment");
  });

  it('🔒 lock된 사용자는 transfer 불가', async function () {
    console.log('addr1 사용 정지(lock)');
    await token.connect(owner).lock(addr1.address);

    console.log('addr1이 transfer 시도 → 실패');
    await expect(
      token.connect(addr1).transfer(addr2.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Your account is locked");
  });
});
