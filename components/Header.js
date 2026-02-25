import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Wallet, Globe, Cpu } from "lucide-react";
import { fakeWallet } from "../utils/fakeWallet";

export default function Header({ onConnect }) {
  const [userAddress, setUserAddress] = useState(null);

  const handleConnect = async (isFake = false) => {
    if (isFake) {
      setUserAddress(fakeWallet.address);
      onConnect(fakeWallet.signer);
      return;
    }
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setUserAddress(await signer.getAddress());
    onConnect(signer);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 p-6 flex justify-center"
    >
      <div className="w-full max-w-7xl flex justify-between items-center bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-2xl px-8 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
            <Cpu size={20} className="text-purple-400" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Stellar<span className="text-purple-500">.</span>
          </span>
        </div>
        
        <div className="flex gap-4 items-center">
          {userAddress ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-3 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-green-400">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-6">
              <button onClick={() => handleConnect(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-colors">
                <Globe size={14} /> Demo
              </button>
              <button onClick={() => handleConnect(false)} className="btn-shiny px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Wallet size={14} /> Connect
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
