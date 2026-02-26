import { ethers } from "ethers";

//контракт из Remix
export const CONTRACT_ADDRESS = "0x48B81B2f981d606e5c29b57b7b85129F8c4Eb46F"; 

export const CONTRACT_ABI = [
  "function mint(uint256 quantity) public payable",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)"
];

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const mintNFT = async (signer, quantity = 1) => {
  const contract = getContract(signer);
  
  const price = ethers.parseEther("0.05"); 
  
  // списание
  const tx = await contract.mint(quantity, {
    value: price * BigInt(quantity)
  });
  
  const receipt = await tx.wait();
  return receipt;
};
