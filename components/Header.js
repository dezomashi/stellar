import { useState } from "react";
import { ethers } from "ethers";
import { fakeWallet } from "../utils/fakeWallet";

export default function Header({ onConnect }) {
  const [userAddress, setUserAddress] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleConnect = async (isFake = false) => {
    if (isFake) {
      setUserAddress(fakeWallet.address);
      setIsDemo(true);
      onConnect(fakeWallet.signer, true);
      return;
    }
    if (!window.ethereum) return alert("Install MetaMask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      setUserAddress(accounts[0]);
      setIsDemo(false);
      onConnect(signer, false);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setUserAddress(null);
    setIsDemo(false);
    onConnect(null, false);
  };

  return (
    <header className="fixed top-0 w-full z-50 p-6 flex justify-center text-white">
      <div className="w-full max-w-7xl flex justify-between items-center bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-3">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg rotate-12 transition-transform duration-500" />
          <span className="text-xl font-black tracking-tighter uppercase italic">Stellar</span>
        </div>
        
        <div className="flex gap-4 items-center">
          {userAddress ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-mono text-[10px] font-bold tracking-widest">
                <div className={`w-2 h-2 rounded-full ${isDemo ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)} {isDemo && "(DEMO)"}
              </div>
              <button onClick={logout} className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition">Exit</button>
            </div>
          ) : (
            <>
              <button onClick={() => handleConnect(true)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition">Demo</button>
              <button onClick={() => handleConnect(false)} className="bg-gradient-to-tr from-purple-600 to-blue-500 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">Connect</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
