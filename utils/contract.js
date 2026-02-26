export const mintNFT = async (signer, quantity = 1) => {
  try {
    const contract = getContract(signer);
    
    const pricePerNFT = ethers.parseEther("0.05"); 
    const totalValue = pricePerNFT * BigInt(quantity);

    console.log("Запрос на списание:", ethers.formatEther(totalValue), "ETH");

    
    const tx = await contract.mint(quantity, {
      value: totalValue, 
    });

    return await tx.wait();
  } catch (error) {
    console.error("Ошибка транзакции:", error);
    throw error;
  }
};
