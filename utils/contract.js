import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x48B81B2f981d606e5c29b57b7b85129F8c4Eb46F";

export const CONTRACT_ABI = [
  "function mint(uint256 quantity) public payable",
  "function totalSupply() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)"
];

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const mintNFT = async (signer, quantity = 1) => {
  try {
    const contract = getContract(signer);
    const price = ethers.parseEther("0.05");
    const totalValue = price * BigInt(quantity);

    const tx = await contract.mint(quantity, {
      value: totalValue,
    });

    return await tx.wait();
  } catch (error) {
    console.error("Execution error:", error);
    throw error;
  }
};
