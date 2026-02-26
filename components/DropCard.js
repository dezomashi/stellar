import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Layers, ChevronRight } from "lucide-react";
import { fakeContract } from "../utils/fakeWallet";
import { getContract, mintNFT } from "../utils/contract";

export default function DropCard({ signer, onMintSuccess }) {
  const [claimed, setClaimed] = useState(fakeContract.claimed);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMint = async () => {
  console.log("Проверка signer...", signer);
  if (!signer) {
    alert("Сначала подключи кошелек!");
    return;
  }

    setIsMinting(true);
    setIsSuccess(false);

    try {
      await fakeContract.claim();
      setClaimed(fakeContract.claimed);
      setIsSuccess(true);
      if (onMintSuccess) onMintSuccess();
    } catch (e) {
      console.error("Minting error:", e);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[450px] px-6 z-10 group"
    >
      <div className="border-gradient shadow-[0_0_80px_rgba(168,85,247,0.1)] hover:shadow-[0_0_100px_rgba(168,85,247,0.25)] transition-shadow duration-700">
        <div className="glass-content relative overflow-hidden">
          
          {/* Декоративная подложка */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full group-hover:bg-purple-600/20 transition-colors" />

          {/* Визуализация NFT */}
          <div className="relative aspect-square mb-10 overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505]">
            <motion.div 
              className="w-full h-full flex items-center justify-center relative"
              animate={isMinting ? { scale: [1, 0.95, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />
              
              <span className={`text-8xl transition-all duration-1000 ${isSuccess ? 'scale-110 rotate-12' : ''} ${isMinting ? 'blur-sm grayscale' : 'drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]'}`}>
                {isSuccess ? '🪐' : '💎'}
              </span>

              <AnimatePresence>
                {isMinting && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-5"
                  >
                    <div className="relative w-16 h-16">
                       <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                       <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="text-[10px] font-black tracking-[0.5em] text-purple-400 animate-pulse uppercase">
                      Syncing with Chain...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Инфо-блок */}
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-purple-500" />
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">Series 001</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter italic text-white leading-none">VOIDWALKER</h2>
              </div>
              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex flex-col items-end">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Price</span>
                <span className="text-sm font-black text-white italic">0.05 ETH</span>
              </div>
            </div>

            {/* Прогресс минта */}
            <div className="space-y-3 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Minting Progress</p>
                   <p className="text-xl font-mono font-bold text-white tracking-tighter">
                    {claimed.toLocaleString()} <span className="text-gray-600 text-sm">/ {fakeContract.maxSupply.toLocaleString()}</span>
                   </p>
                </div>
                <div className="text-[10px] font-black text-purple-400">
                  {Math.round((claimed / fakeContract.maxSupply) * 100)}%
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(claimed / fakeContract.maxSupply) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-blue-500 relative"
                />
              </div>
            </div>

            
            <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  console.log("вызываю handleMint...");
                  handleMint();
                }}
                disabled={isMinting}
                className="btn-shiny w-full py-5 rounded-[1.8rem] flex items-center justify-center gap-3 active:scale-95 transition-all z-20"
              >
                <span className="font-black text-[11px] uppercase tracking-[0.4em] text-white">
                  {isMinting ? "Broadcasting..." : "Mint Core NFT"}
                </span>
                {!isMinting && <ChevronRight size={18} />}
            </button>

            {/* Футер карточки */}
            <div className="flex justify-center gap-6 opacity-30 group-hover:opacity-60 transition-opacity">
               <ShieldCheck size={16} />
               <Zap size={16} />
               <Sparkles size={16} />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
