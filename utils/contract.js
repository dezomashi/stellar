import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xbf7d34B58D05B17AdC1B59121a61Fde0ae27f7e9";

export const CONTRACT_ABI = [
  "function mint(uint256 quantity) public payable",
  "function totalSupply() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)"
];

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const mintNFT = async (signer, quantity = 1) => {
  const chainId = "0xaa36a7";
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainId,
          chainName: 'Sepolia Test Network',
          rpcUrls: ['https://rpc.ankr.com'],
          nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
          blockExplorerUrls: ['https://sepolia.etherscan.io']
        }],
      });
    }
  }

  const contract = getContract(signer);
  const price = ethers.parseEther("0.05");
  const totalValue = price * BigInt(quantity);

  const tx = await contract.mint(quantity, {
    value: totalValue,
  });

  return await tx.wait();
};
