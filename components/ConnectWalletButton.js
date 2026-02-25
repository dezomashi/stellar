import { useState } from "react";
import { fakeWallet } from "../utils/fakeWallet";

export default function ConnectWalletButton({ onConnect }) {
  const [address, setAddress] = useState(null);

  const handleConnect = async () => {
    // Симуляция подключения кошелька
    setAddress(fakeWallet.address);
    onConnect(fakeWallet.signer);
  };

  return (
    <button
      className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-lg font-bold"
      onClick={handleConnect}
    >
      {address ? address.slice(0, 6) + "..." + address.slice(-4) : "Connect Wallet"}
    </button>
  );
}