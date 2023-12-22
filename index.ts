const { Web3Auth } = require("@web3auth/node-sdk");
const { EthereumPrivateKeyProvider } = require("@web3auth/ethereum-provider");
import {
    WALLET_ADAPTERS,
  } from "@web3auth/base";
const jwt = require('jsonwebtoken');
const fs = require('fs');
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

const web3auth = new Web3Auth({
  clientId: "BDP7V01IbikdxmZdd6NbR2G39xFNFCwhEDy-wALJNQ8GfShT0jEyQQfyzfwYv_iyyGbo4SHz3TGCFavgBilMDaY", // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: "sapphire_devnet", // Get your Network ID from Web3Auth Dashboard
});

const ethereumProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: {
      chainId: "0x1",
      rpcTarget: "https://rpc.ankr.com/eth"
    }
  }
});

web3auth.init({ provider: ethereumProvider });

var privateKey = fs.readFileSync('privateKey.pem');

var token = jwt.sign(
  {
    name: 'Sadik Saifi',
    sortedwallet: 'sortedwallet',
    email: 'mridulghanshala@gmail.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  },
  privateKey,
  { algorithm: 'RS256', keyid: '2ma4enu1kdvw5bo9xsfpi3gcjzrt6q78yl0h' },
);
console.log(token);

const connect = async () => {
  const provider = await web3auth.connect({
    verifier: "sorted-wallet", // replace with your verifier name
    verifierId: "mridulghanshala@gmail.com", // replace with your verifier id's value, for example, sub value of JWT Token, or email address.
    idToken: token, // replace with your newly created unused JWT Token.
  });
  const eth_private_key = await provider.request({ method: "eth_private_key" });
  console.log("ETH PrivateKey: ", eth_private_key);
  const eth_address = await provider.request({ method: "eth_accounts" });
  console.log("ETH Address: ", eth_address[0]);
  process.exit(0);
};
connect();

const web3authProvider = async () => await web3auth.connectTo(
    WALLET_ADAPTERS.OPENLOGIN,
    {
      loginProvider: "jwt",
      extraLoginOptions: {
        id_token: token,
        verifierIdField: "email",
      },
    }
  );

  web3authProvider();

  const getAccounts = async ():Promise<IProvider> => {
    if (!web3authProvider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRpc(web3authProvider);
    const userAccount = await rpc.getAccounts();
    console.log(userAccount);
  };

  export default class EthereumRpc {
    private provider: IProvider;
  
    constructor(provider: IProvider) {
      this.provider = provider;
    }
  
    async getChainId(): Promise<any> {
      try {
        // For ethers v5
        // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
        const ethersProvider = new ethers.BrowserProvider(this.provider);
        // Get the connected Chain's ID
        const networkDetails = await ethersProvider.getNetwork();
        return networkDetails.chainId;
      } catch (error) {
        return error;
      }
    }
  
    async getAccounts(): Promise<any> {
      try {
        // For ethers v5
        // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
        const ethersProvider = new ethers.BrowserProvider(this.provider);
  
        // For ethers v5
        // const signer = ethersProvider.getSigner();
        const signer = await ethersProvider.getSigner();
  
        // Get user's Ethereum public address
        const address = signer.getAddress();
  
        return await address;
      } catch (error) {
        return error;
      }
    }
  
    async getBalance(): Promise<string> {
      try {
        // For ethers v5
        // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
        const ethersProvider = new ethers.BrowserProvider(this.provider);
  
        // For ethers v5
        // const signer = ethersProvider.getSigner();
        const signer = await ethersProvider.getSigner();
  
        // Get user's Ethereum public address
        const address = signer.getAddress();
  
        // Get user's balance in ether
        // For ethers v5
        // const balance = ethers.utils.formatEther(
        // await ethersProvider.getBalance(address) // Balance is in wei
        // );
        const balance = ethers.formatEther(
          await ethersProvider.getBalance(address) // Balance is in wei
        );
  
        return balance;
      } catch (error) {
        return error as string;
      }
    }
  
    async sendTransaction(): Promise<any> {
      try {
        // For ethers v5
        // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
        const ethersProvider = new ethers.BrowserProvider(this.provider);
  
        // For ethers v5
        // const signer = ethersProvider.getSigner();
        const signer = await ethersProvider.getSigner();
  
        const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
  
        // Convert 1 ether to wei
        // For ethers v5
        // const amount = ethers.utils.parseEther("0.001");
        const amount = ethers.parseEther("0.001");
  
        // Submit transaction to the blockchain
        const tx = await signer.sendTransaction({
          to: destination,
          value: amount,
          maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
          maxFeePerGas: "6000000000000", // Max fee per gas
        });
  
        // Wait for transaction to be mined
        const receipt = await tx.wait();
  
        return receipt;
      } catch (error) {
        return error as string;
      }
    }
  
    async signMessage() {
      try {
        // For ethers v5
        // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
        const ethersProvider = new ethers.BrowserProvider(this.provider);
  
        // For ethers v5
        // const signer = ethersProvider.getSigner();
        const signer = await ethersProvider.getSigner();
        const originalMessage = "YOUR_MESSAGE";
  
        // Sign the message
        const signedMessage = await signer.signMessage(originalMessage);
  
        return signedMessage;
      } catch (error) {
        return error as string;
      }
    }
  
    async getPrivateKey(): Promise<any> {
      try {
        const privateKey = await this.provider.request({
          method: "eth_private_key",
        });
  
        return privateKey;
      } catch (error) {
        return error as string;
      }
    }
  }