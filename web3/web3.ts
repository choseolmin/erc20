import Web3 from 'web3';
import MyTokenArtifact from '../artifacts/contracts/MyToken.sol/MyToken.json';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const web3 = new Web3('http://127.0.0.1:7545');
const { abi: MyTokenABI } = MyTokenArtifact;
const MyTokenAddress = require('../abis/MyToken.json').address;

export const getContract = () => {
  if (!MyTokenAddress) throw new Error('MyTokenAddress is undefined');
  return new web3.eth.Contract(MyTokenABI, MyTokenAddress);
};

export const transfer = async (from: string, to: string, amount: string | number | bigint) => {
  amount = amount.toString();
  const contract = getContract();

  const tx = contract.methods.transfer(to, amount);
  const gas = (await tx.estimateGas({ from })).toString();

  const receipt = await tx.send({ from, gas });
  return receipt.transactionHash;
};

export const approve = async (spender: string, amount: string | number | bigint) => {
  amount = amount.toString();
  const contract = getContract();

  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];

  const tx = contract.methods.approve(spender, amount);
  const gas = (await tx.estimateGas({ from })).toString();

  const receipt = await tx.send({ from, gas });
  return receipt.transactionHash;
};


export const transferFrom = async (spender: string, from: string, to: string, amount: string | number | bigint) => {
  amount = amount.toString();
  const contract = getContract();

  const tx = contract.methods.transferFrom(from, to, amount);
  const gas = (await tx.estimateGas({ from: spender })).toString();

  const receipt = await tx.send({ from: spender, gas });
  return receipt.transactionHash;
};

export const getWeb3 = () => {
  return web3;
};

export const getChainId = async () => {
  return await web3.eth.net.getId();
};

export const totalSupply = async () => {
  const contract = getContract();
  const supply: string = await contract.methods.totalSupply().call(); 
  return BigInt(supply); 
};

export const balanceOf = async (address: string) => {
  const contract = getContract();
  const balance = await contract.methods.balanceOf(address).call();
  return balance ? balance.toString() : '0';
};

export const getOwner = async () => {
  const accounts = await web3.eth.getAccounts();
  return { address: accounts[0] }; 
};

export const allowance = async (owner: string, spender: string) => {
  const contract = getContract();
  const allowed = await contract.methods.allowance(owner, spender).call();
  return allowed ? allowed.toString() : '0';
};
