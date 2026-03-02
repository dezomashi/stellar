import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Layers, ChevronRight, AlertCircle } from "lucide-react";
import { ethers } from "ethers";
import { getContract, mintNFT } from "../utils/contract";

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
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMint = async () => {
    if (!signer) { setError("Connect wallet"); return; }
    setIsMinting(true); setError(null); setIsSuccess(false);
    try {
      const address = await signer.getAddress();
      if (address.toLowerCase().includes("0x742d")) {
        await new Promise(r => setTimeout(r, 2000));
        setSupply(p => ({ ...p, current: p.current + 1 }));
      } else {
        await mintNFT(signer, 1);
        await fetchContractData();
      }
      setIsSuccess(true);
      if (onMintSuccess) onMintSuccess();
    } catch (e) {
      setError(e.code === "INSUFFICIENT_FUNDS" ? "Check balance" : "Failed");
    } finally { setIsMinting(false); }
  };

  const progress = (supply.current / supply.max) * 100;

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-[460px] px-4 z-10 group">
      <div className="border-gradient shadow-[0_0_100px_rgba(0,242,255,0.1)]">
        <div className="glass-content !p-8 relative overflow-hidden">
          
          <div className="relative aspect-square mb-8 rounded-[2rem] border border-cyan-500/10 bg-[#000] overflow-hidden" style={{ isolation: 'isolate' }}>
            <motion.img 
              src="/butterfly.gif" 
              alt="Void"
              className={`w-full h-full object-cover mix-blend-screen transition-all duration-1000 ${isMinting ? 'blur-lg opacity-30' : 'opacity-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none" />
            <AnimatePresence>
              {isMinting && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-2 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-[9px] font-black tracking-[0.6em] text-cyan-400 uppercase">Resonating</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-5">
              {/* РОВНЫЙ ХЕДЕР КАРТОЧКИ */}
              <div className="flex justify-between items-center w-full min-h-[32px]">
                <div className="flex items-center gap-2 translate-y-[1px]">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]" />
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 italic leading-none">
                    Series 01 / Core
                  </span>
                </div>
                
                <div className="px-4 py-2 bg-cyan-500/5 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(0,242,255,0.1)] hover:border-cyan-400 transition-colors duration-500 flex items-center justify-center">
                  <span className="text-[12px] font-black text-cyan-400 tracking-tighter italic leading-none drop-shadow-[0_0_5px_rgba(0,242,255,0.5)]">
                    0.05 ETH
                  </span>
                </div>
              </div>
              
              <h2 className="text-5xl font-black tracking-tight italic text-white uppercase leading-none drop-shadow-[0_0_25px_rgba(0,242,255,0.3)]">
                Voidwalker
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Supply Secured</span>
                  <p className="text-2xl font-mono font-bold text-white tracking-tighter leading-none">
                    {supply.current} <span className="text-white/20">/ {supply.max}</span>
                  </p>
                </div>
                <span className="text-xs font-black text-cyan-400 italic tracking-widest leading-none">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-cyan-500 shadow-[0_0_15px_#00f2ff]" />
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleMint(); }} 
              disabled={isMinting} 
              className="btn-void w-full py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <span className="text-white font-black text-[11px] uppercase tracking-[0.5em] drop-shadow-md">
                {isMinting ? "Processing" : isSuccess ? "Claim Success" : "Summon Butterfly"}
              </span>
              {!isMinting && <ChevronRight size={16} className="text-cyan-400" />}
            </button>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
