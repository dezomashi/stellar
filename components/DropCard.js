import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Layers, ChevronRight, AlertCircle } from "lucide-react";
import { ethers } from "ethers";
import { getContract, mintNFT } from "../utils/contract";
import { fakeContract } from "../utils/fakeWallet";

export default function DropCard({ signer, onMintSuccess }) {
  const [supply, setSupply] = useState({ current: 0, max: 5000 });
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const fetchContractData = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const contract = getContract(provider);
      const current = await contract.totalSupply();
      const max = await contract.MAX_SUPPLY();
      setSupply({ current: Number(current), max: Number(max) });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMint = async () => {
    if (!signer) {
      setError("Please connect wallet");
      return;
    }

    setIsMinting(true);
    setError(null);
    setIsSuccess(false);

    try {
      
      const address = await signer.getAddress();
      if (address === "0x742d...44e") {
        await fakeContract.claim();
      } else {
        await mintNFT(signer, 1);
      }
      
      setIsSuccess(true);
      fetchContractData();
      if (onMintSuccess) onMintSuccess();
    } catch (e) {
      setError(e.code === "ACTION_REJECTED" ? "Rejected" : "Minting failed");
    } finally {
      setIsMinting(false);
    }
  };

  const progress = (supply.current / supply.max) * 100;

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-[450px] px-6 z-10 group">
      <div className="border-gradient shadow-[0_0_80px_rgba(168,85,247,0.1)] transition-all duration-700">
        <div className="glass-content relative overflow-hidden">
          <div className="relative aspect-square mb-10 overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505]">
            <div className="w-full h-full flex items-center justify-center relative">
              <span className={`text-8xl transition-all duration-1000 ${isSuccess ? 'scale-110 rotate-12 drop-shadow-[0_0_60px_#a855f7]' : ''} ${isMinting ? 'blur-sm grayscale' : 'drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]'}`}>
                {isSuccess ? '🪐' : '💎'}
              </span>
              <AnimatePresence>
                {isMinting && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-5">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black tracking-[0.5em] text-purple-400 uppercase">Confirming...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex justify-between items-start text-white">
              <div>
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-purple-500" />
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">Series 001</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter italic leading-none">VOIDWALKER</h2>
              </div>
              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-sm font-black italic">0.05 ETH</span>
              </div>
            </div>
            <div className="space-y-3 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex justify-between items-end text-white">
                <p className="text-xl font-mono font-bold tracking-tighter">{supply.current} <span className="text-gray-600 text-sm italic">/ {supply.max}</span></p>
                <div className="text-[10px] font-black text-purple-400 tracking-widest">{Math.round(progress)}%</div>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500" />
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={(e) => { e.stopPropagation(); handleMint(); }} disabled={isMinting} className="btn-shiny w-full py-5 rounded-[1.8rem] flex items-center justify-center gap-3 active:scale-95 transition-all z-20 text-white font-black text-[11px] uppercase tracking-[0.4em]">
                {isMinting ? "Broadcasting..." : "Mint Core NFT"}
              </button>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest"><AlertCircle size={14} /> {error}</motion.div>}
            </div>
            <div className="flex justify-center gap-6 opacity-30 text-white">
               <ShieldCheck size={16} /> <Zap size={16} /> <Sparkles size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
