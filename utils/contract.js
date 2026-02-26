export const mintNFT = async (signer, quantity = 1) => {
  try {
    const contract = getContract(signer);
    
    const pricePerNFT = ethers.parseEther("0.05"); 
    const totalValue = pricePerNFT * BigInt(quantity);

    console.log("Попытка минта. Сумма:", ethers.formatEther(totalValue), "ETH");

    const tx = await contract.mint(quantity, {
      value: totalValue
    });

    console.log("Запрос отправлен в MetaMask! Хеш:", tx.hash);
    return await tx.wait();
  } catch (error) {

    console.error("Критическая ошибка минта:", error);
    throw error;
  }
};
