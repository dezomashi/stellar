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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const notify = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  if (!isClient) return <div className="bg-[#01030a] w-screen h-screen" />;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#01030a]">
      <div className="absolute inset-0 z-0 opacity-40">
        <Background3D />
        <GridBackground />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#01030a_100%)] z-1 pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="w-[1000px] h-[1000px] bg-cyan-500 blur-[180px] rounded-full"
        />
      </div>

      <Header onConnect={setSigner} />
      
      <main className="h-full flex items-center justify-center relative z-10">
        <DropCard signer={signer} onMintSuccess={() => notify("Butterfly Resonated Successfully")} />
      </main>

      <Toast isVisible={showToast} message={toastMsg} onClose={() => setShowToast(false)} />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com');
        body { background: #01030a; cursor: crosshair; }
      `}</style>
    </div>
  );
}
