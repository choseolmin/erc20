import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    hardhat: {},
    ganache: {
      url: 'http://127.0.0.1:7545',
      accounts: [process.env.PRIVATE_KEY || ''],
    },
    kairos: {
      url: 'https:public-en-kairos.node.kaia.io',
      accounts: [process.env.A_PRIVATE_KEY!, process.env.B_PRIVATE_KEY!],
      chainId: 1001,
    },
  },
};

export default config;
