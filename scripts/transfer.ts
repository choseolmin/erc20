require("dotenv").config();
const { ethers } = require("ethers");

// 📌 배포된 ERC-20 컨트랙트 주소
const contractAddress = "0x160333145E1063ea9a66C43e1C840737181C7beC"; // 너의 실제 배포 주소 입력

// 📌 ABI 불러오기
const contractArtifact = require("../artifacts/contracts/MyToken.sol/MyToken.json");
const abi = contractArtifact.abi;

// 📌 카이로스 네트워크 프로바이더 설정
const provider = new ethers.JsonRpcProvider("https://public-en-kairos.node.kaia.io");

// 📌 지갑 연결 (.env의 PRIVATE_KEY 사용)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 📌 스마트 컨트랙트 인스턴스 생성
const contract = new ethers.Contract(contractAddress, abi, wallet);

// 📌 ERC-20 transfer 호출 함수
async function transferToken() {
  try {
    const toAddress = "0x5ba28312193C12AD43611aA81602d7e56Df578Ed"; // 전송할 지갑 주소
    const amount = ethers.parseUnits("100", 18); // 1 토큰 (소수점 18자리 기준)

    const tx = await contract.transfer(toAddress, amount);
    await tx.wait();

    console.log(`📌 Transfer 성공! TxHash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Transfer 실패:", error);
  }
}

// 📌 실행
transferToken();
