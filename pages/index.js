import { useState, useEffect } from "react";
import Header from "../components/Header";
import DropCard from "../components/DropCard";
import Background3D from "../components/Background3D";
import GridBackground from "../components/GridBackground";
import Toast from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [signer, setSigner] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [systemLogs, setSystemLogs] = useState([]);

  // 1. Sound Engine (Генератор звуков будущего)
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'success') {
        // Звук "победы" (восходящий)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'connect') {
        // Мягкий звук подключения
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("Audio Context not supported or blocked");
    }
  };

  // 2. Система уведомлений
  const notify = (msg, type = "success") => {
    setToastMsg(msg);
    setShowToast(true);
    playSound(type === "success" ? 'success' : 'connect');
    setTimeout(() => setShowToast(false), 5000);
  };

  // 3. Эффект "хакерской" консоли (Logs)
  useEffect(() => {
    const bootMessages = [
      "Initializing Stellar_Protocol v.2.0.4",
      "Syncing with Ethereum Mainnet...",
      "Neural link established",
      "Awaiting User Authorization..."
    ];
    
    bootMessages.forEach((msg, i) => {
      setTimeout(() => {
        setSystemLogs(prev => [...prev, `> ${msg}`].slice(-4));
      }, i * 1200);
    });
  }, []);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#020106] select-none"
      onClick={() => playSound('click')}
    >
      {/* --- LAYER 0: Backgrounds --- */}
      <div className="absolute inset-0 z-0">
        <Background3D />
        <GridBackground />
      </div>

      {/* --- LAYER 1: Ambient Effects --- */}
      {/* Виньетка (затемнение краев) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020106_100%)] z-[1] pointer-events-none" />
      
      {/* Световые пятна (Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* --- LAYER 2: Content --- */}
      <Header onConnect={(s) => {
        setSigner(s);
        notify("Authorization Success: Wallet Linked", "connect");
      }} />
      
      <main className="relative z-10 h-full flex items-center justify-center">
        {/* Боковые декоративные линии */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 opacity-30">
          {[1, 2, 3].map(i => (
            <div key={i} className="group flex flex-col gap-2">
              <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent group-hover:h-20 transition-all duration-700" />
              <span className="text-[8px] font-black vertical-text tracking-widest text-gray-500">SEC_0{i}</span>
            </div>
          ))}
        </div>

        {/* Главная карточка */}
        <DropCard 
          signer={signer} 
          onMintSuccess={() => notify("Asset Secured: NFT Minted Successfully")} 
        />

        {/* Правый декоративный лог */}
        <div className="absolute bottom-12 right-12 hidden lg:block text-right">
          <AnimatePresence>
            {systemLogs.map((log, i) => (
              <motion.p 
                key={i + log}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-mono text-purple-500/50 uppercase tracking-widest leading-relaxed"
              >
                {log}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- LAYER 3: Overlay UI --- */}
      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />

      <style jsx global>{`
        @font-face {
          font-family: 'Inter';
          src: url('https://fonts.googleapis.com');
        }

        body {
          cursor: crosshair;
          user-select: none;
        }

        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        /* Анимация перелива для всех градиентов */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
