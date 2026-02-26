export const fakeWallet = {
  address: "0x742d...44e",
  balance: "1.25 ETH",
  signer: {
    getAddress: async () => "0x742d...44e",
    signTransaction: async () => "0x" + Math.random().toString(16).slice(2, 12),
  },
};

export const fakeContract = {
  totalSupply: 5000,
  maxSupply: 5000,
  claimed: 0, 
  async claim() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.claimed >= this.maxSupply) {
          reject(new Error("Sold out"));
        } else {
          this.claimed += 1;
          resolve({ txHash: "0x" + Math.random().toString(16).slice(2, 20) });
        }
      }, 2000); // Имитация ожидания блокчейна
    });
  },
};
