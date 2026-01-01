'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Terminal,
  ChevronRight,
  Download,
  Smartphone,
  Ban, 
  Lock,
  Activity 
} from 'lucide-react';
import useSound from 'use-sound';
import { ReactLenis } from '@studio-freight/react-lenis';

// --- Cursor Context ---
const CursorContext = React.createContext({
  variant: 'default',
  setVariant: (variant: 'default' | 'button' | 'text') => {}
});

// --- Components ---

const CustomCursor = () => {
  const { variant } = useContext(CursorContext);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const variants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
      border: '1px solid #00D9FF',
    },
    button: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(0, 217, 255, 0.1)',
      border: '1px solid #00D9FF',
    },
    text: {
      width: 8,
      height: 8,
      backgroundColor: '#00D9FF',
      border: 'none',
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden lg:block backdrop-blur-[1px]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
      variants={variants}
      animate={variant}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {/* Ghost Trail simulated by laggy opacity */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-[#00D9FF] opacity-20"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
};

const MagneticButton = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setVariant } = useContext(CursorContext);
  const [isClicking, setIsClicking] = useState(false);
  
  // Sounds
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.5 });
  const [playClick] = useSound('/sounds/click.mp3');

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = async () => {
    playClick();
    setIsClicking(true);
    if (onClick) onClick();
    setTimeout(() => setIsClicking(false), 2000);
  };

  return (
    <motion.button
      ref={ref}
      className={`${className} relative overflow-hidden`}
      onMouseMove={handleMouse}
      onMouseLeave={() => { reset(); setVariant('default'); }}
      onMouseEnter={() => { 
        setVariant('button');
        playHover();
      }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={handleClick}
    >
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-500 z-50 flex items-center justify-center font-bold text-[#0A1929] tracking-widest"
          >
            INITIATING...
          </motion.div>
        )}
      </AnimatePresence>
      {/* Flash Effect */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white z-[60]"
          />
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]); // Inverted logic for tilt
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) / 4); // Dampener
    y.set((event.clientY - centerY) / 4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Shine Effect */}
      <motion.div 
        style={{
          background: useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 80%)`,
        }}
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    </motion.div>
  );
};

const PhoneMockup = () => {
  return (
    <div className="w-[300px] h-[600px] border-8 border-[#1e293b] rounded-[3rem] bg-[#0A1929] relative overflow-hidden shadow-2xl z-10">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1e293b] rounded-b-xl z-20" />
      
      {/* Scanner Animation */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] bg-[#00D9FF] shadow-[0_0_20px_#00D9FF] opacity-50 z-30 pointer-events-none"
      >
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#00D9FF]/20 to-transparent" />
      </motion.div>
      
      {/* Screen Content */}
      <div className="absolute inset-0 pt-12 px-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xs text-white/50 font-mono">10:42 AM</div>
          <div className="text-xs text-[#00D9FF] font-mono">JARVIS ACTIVE</div>
        </div>

        {/* Energy Widget */}
        <div className="bg-[#112235]/80 backdrop-blur border border-white/5 p-4 rounded-2xl mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-50">
             <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
          </div>
          <div className="text-white text-xs mb-1 uppercase tracking-wider font-medium opacity-80">Energy Forecast</div>
          <div className="text-2xl font-bold text-white mb-2 drop-shadow-md">Category 4 Day</div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[80%] bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]" />
          </div>
          <div className="mt-2 text-xs text-[#00D9FF] font-bold">High cognitive load expected.</div>
        </div>

        {/* Context Items */}
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white/5 border-l-2 border-orange-500">
            <div className="text-xs text-white/50 mb-1">Warning</div>
            <div className="text-sm text-white">Meeting density high. 2h gap required.</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border-l-2 border-green-500">
            <div className="text-xs text-white/50 mb-1">Recovery</div>
            <div className="text-sm text-white">Sleep data optimal (+8 hrs).</div>
          </div>
        </div>
      </div>
      
      {/* Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

const DiagnosticTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const allLines = [
    "> SYSTEM DIAGNOSTIC...",
    "> DETECTED: 3 MEETINGS + HEAVY LEG DAY",
    "> PREDICTION: 85% CHANCE OF BURNOUT BY 4PM",
    "> REMEDY: INITIATE 'DEEP WORK' PROTOCOL NOW?",
    "> [ Y / N ]"
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      setLines(prev => {
        if (currentLine >= allLines.length) {
            return prev;
        }
        const newLine = allLines[currentLine];
        currentLine++;
        return [...prev, newLine];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-lg mx-auto mb-20 -mt-10 bg-[#0A1929]/80 backdrop-blur-md border border-[#00D9FF]/20 rounded-lg p-6 font-mono text-sm shadow-[0_0_30px_rgba(0,217,255,0.1)] relative z-20 group cursor-default"
    >
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-50" />
       <div className="space-y-2">
         {lines.map((line, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             className={i === 4 ? "text-[#00D9FF] font-bold" : "text-[#94A3B8]"}
           >
             {line} {i === 4 && <span className="animate-pulse">_</span>}
           </motion.div>
         ))}
         {lines.length === 0 && <div className="text-[#00D9FF]/50 animate-pulse">Initializing...</div>}
       </div>
    </motion.div>
  );
}

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [text, setText] = useState<string[]>([]);
  
  useEffect(() => {
    const sequence = [
      { text: "INITIALIZING SECURE CONNECTION...", delay: 500 },
      { text: "ESTABLISHING NEURAL LINK...", delay: 1200 },
      { text: "VERIFYING BIOMETRICS...", delay: 2000 },
      { text: "ACCESS GRANTED.", delay: 2800 },
    ];
    
    let timeoutIds: NodeJS.Timeout[] = [];
    
    sequence.forEach(({ text, delay }) => {
      const id = setTimeout(() => {
         setText(prev => [...prev, text]);
      }, delay);
      timeoutIds.push(id);
    });
    
    const finishId = setTimeout(onComplete, 3500); 
    timeoutIds.push(finishId);

    return () => timeoutIds.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono text-[#00D9FF] text-sm md:text-base pointer-events-none cursor-none"
    >
       <div className="w-64 space-y-2">
         {text.map((t, i) => (
           <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
             {'>'} {t}
           </motion.div>
         ))}
         <motion.div 
           animate={{ opacity: [0, 1, 0] }} 
           transition={{ repeat: Infinity, duration: 0.5 }}
           className="h-4 w-2 bg-[#00D9FF] mt-2"
        />
       </div>
    </motion.div>
  );
};

// --- Sections ---

export const LandingPage = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const [cursorVariant, setCursorVariant] = useState<'default' | 'button' | 'text'>('default');
  const [showBoot, setShowBoot] = useState(true);
  
  // --- Scarcity Logic ---
  const [betaSpots, setBetaSpots] = useState(142);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setBetaSpots(prev => Math.max(12, prev - 1));
      }
    }, 8000); // Check every 8 seconds for a more "alive" feel, but drop randomly
    return () => clearInterval(interval);
  }, []);

  // --- Easter Egg Logic ---
  const [logoClicks, setLogoClicks] = useState(0);
  const [showTerminal, setShowTerminal] = useState(false);
  const [typedText, setTypedText] = useState("");
  
  const fullText = "> HELLO, OBSERVER.\n> READY TO OPTIMIZE?";

  useEffect(() => {
    if (logoClicks >= 5) {
      setShowTerminal(true);
      setLogoClicks(0);
      setTypedText("");
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(fullText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    }
  }, [logoClicks]);

  // Parallax for phone
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // --- Background Data Logic (Client Only) ---
  const [backgroundData, setBackgroundData] = useState<any[]>([]);

  useEffect(() => {
    // Generate static data once on mount to avoid hydration mismatch
    const data = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      direction: i % 2 === 0 ? "left" : "right",
      duration: 40 + Math.random() * 20,
      content: Array.from({ length: 10 }).map((_, j) => ({
        key: j,
        hex1: Math.floor(Math.random()*16777215).toString(16).toUpperCase(),
        hex2: Math.floor(Math.random()*16777215).toString(16).toUpperCase(),
        hex3: Math.floor(Math.random()*16777215).toString(16).toUpperCase(),
      }))
    }));
    setBackgroundData(data);
  }, []);

  return (
    <CursorContext.Provider value={{ variant: cursorVariant, setVariant: setCursorVariant }}>
      <ReactLenis root>
        <AnimatePresence>
          {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}
        </AnimatePresence>
        <div 
          className="min-h-screen bg-[#0A1929] text-white font-sans selection:bg-[#00D9FF]/30 selection:text-[#00D9FF] overflow-x-hidden cursor-none"
          onMouseEnter={() => setCursorVariant('default')}
        >
        <CustomCursor />
        
        {/* Background Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
      />

      {/* SECTION 1: HERO */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center relative overflow-hidden py-20">
        {/* Glow Effect behind phone */}
        <motion.div 
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.25, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D9FF] blur-[150px] rounded-full pointer-events-none z-0" 
        />
        
        <div className="z-10 text-center relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-display tracking-tighter mb-6 leading-[0.9]">
              YOUR BODY. <br />
              YOUR WORK. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-white/80">CONNECTED.</span>
            </h1>
            
            <p className="text-[#94A3B8] text-lg md:text-xl max-w-xl mx-auto mb-12 font-light tracking-wide">
              The AI copilot that stops you from burning out. <br className="hidden md:block" />
              <span className="text-white/80">The Private Vault Strategy.</span>
            </p>

            <MagneticButton 
              onClick={() => router.push('/dashboard')}
              className="group relative px-10 py-5 bg-transparent border border-[#00D9FF] rounded-full text-[#00D9FF] font-bold overflow-visible z-10 transition-colors hover:text-[#0A1929] shadow-[0_0_30px_rgba(0,217,255,0.2)]"
            >
              <div className="absolute inset-0 bg-[#00D9FF] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                ACCESS PROTOCOL <ChevronRight size={18} />
              </span>
            </MagneticButton>
            
            <motion.div 
              key={betaSpots}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col items-center gap-2 font-mono text-xs tracking-widest"
            >
              <div className="text-[#00D9FF]">
                [ SYSTEM STATUS: ONLINE ]
              </div>
              <div className="text-[#94A3B8]">
                • <span className="text-white font-bold">BETA SPOTS REMAINING: {betaSpots}</span> •
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Phone Floating */}
        <motion.div 
          style={{ y: phoneY, rotate: -5 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="lg:absolute lg:right-[10%] lg:top-[50%] lg:-translate-y-1/2 mt-20 lg:mt-0 hidden md:block"
        >
          <PhoneMockup />
        </motion.div>
      </section>

      <DiagnosticTerminal />

      {/* SECTION 2: THE PROBLEM (Graph) */}
      <section className="py-32 px-6 bg-[#050C14] relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold font-display mb-8"
            >
              The Grinder's Paradox.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-[#94A3B8] text-lg font-light leading-relaxed"
            >
              <p>You go hard at the gym.</p>
              <p>You go hard at work.</p>
              <p>You think you can do both at 100%.</p>
              <p className="text-white font-medium text-xl">You can't.</p>
              <p>That's why you crash every 3 months. JARVIS sees the patterns you miss.</p>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 h-[400px] relative bg-[#09121D] border border-white/5 rounded-3xl p-8 flex items-end">
             {/* Graph Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
             
             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
               {/* Line 1: Crash */}
               <motion.path
                 d="M0,350 Q100,200 200,380"
                 fill="none"
                 stroke="#ef4444"
                 strokeWidth="3"
                 initial={{ pathLength: 0, opacity: 0 }}
                 whileInView={{ pathLength: 1, opacity: 0.5 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
               />
               
               {/* Line 2: Sustained */}
               <motion.path
                 d="M0,350 Q150,250 400,100"
                 fill="none"
                 stroke="#00D9FF"
                 strokeWidth="4"
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
               />
             </svg>
             
             {/* Labels */}
             <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-[45%] text-red-500 text-xs font-mono"
             >
                CRASH w/o JARVIS
             </motion.div>
             <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute top-20 right-10 text-[#00D9FF] text-xs font-mono"
             >
                OPTIMIZED w/ JARVIS
             </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE INSIGHT (Glassmorphism) */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-20">
          
          {/* The Glass Card Animation */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full md:w-1/2 flex justify-center perspective-1000"
          >
            <TiltCard className="relative w-full max-w-md p-8 rounded-[2rem] border border-white/10 bg-[#0F2942]/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transform-gpu">
              
              {/* Glossy Reflection */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#00D9FF] rounded-2xl flex items-center justify-center text-[#0A1929] shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                    <Terminal size={24} strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base tracking-wide">JARVIS</div>
                    <div className="text-sm text-[#94A3B8]">Just now • Insight</div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-display font-bold mb-6 text-white leading-tight">Pattern Detected</h3>
                
                <div className="space-y-4 text-lg">
                  <p className="text-[#94A3B8] leading-relaxed">
                    You complete <span className="text-[#00D9FF] font-bold bg-[#00D9FF]/10 px-2 py-0.5 rounded">85% more tasks</span> on days you do morning cardio.
                  </p>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-[#94A3B8] text-sm italic">
                      "Your workout isn't just for your body. It's an ROI multiplier for your business."
                    </p>
                  </div>
                </div>

                {/* Simulated Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <div className="flex-1 py-3 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] text-center text-sm font-bold cursor-pointer hover:bg-[#00D9FF]/20 transition-colors">
                    Add Block
                  </div>
                  <div className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-center text-sm font-bold cursor-pointer hover:bg-white/10 transition-colors">
                    Dismiss
                  </div>
                </div>
              </div>
            
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none" />

            </TiltCard>
          </motion.div>

          <div className="w-full md:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold font-display mb-8 leading-[0.9]"
            >
              It sees what <br/>
              <span className="text-[#00D9FF]">you don't.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#94A3B8] text-xl leading-relaxed max-w-lg font-light"
            >
              You think you're just tired. JARVIS knows you're recovering from leg day and your calendar is too full. It rebuilds your schedule before you crash.
            </motion.p>
          </div>

        </div>
      </section>

      {/* SECTION 4: PRIVACY */}
      <section className="py-32 bg-gradient-to-b from-[#0A1929] to-[#020609] border-y border-white/5 relative overflow-hidden">
        
        {/* RAW DATA BACKGROUND */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden font-mono text-sm leading-8 text-[#00D9FF]">
           {backgroundData.map((row) => (
             <motion.div 
               key={row.id}
               initial={{ x: row.direction === "left" ? "0%" : "-50%" }}
               animate={{ x: row.direction === "left" ? "-50%" : "0%" }}
               transition={{ duration: row.duration, repeat: Infinity, ease: "linear" }}
               className="whitespace-nowrap"
             >
                {row.content.map((item: any) => (
                  <span key={item.key} className="mx-4">
                    0x{item.hex1} 
                    0x{item.hex2}
                    ::ENCRYPTED:: 
                    0x{item.hex3}
                  </span>
                ))}
             </motion.div>
           ))}
        </div>

        {/* Connection Line Graphic */}
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          
          {/* The Network Diagram */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8 mb-16 relative"
          >
            {/* Phone Node */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-40 border-4 border-[#00D9FF] rounded-[2rem] bg-[#0A1929] flex items-center justify-center relative shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                <div className="absolute top-4 w-12 h-1 bg-white/20 rounded-full" />
                <Shield className="text-[#00D9FF] w-8 h-8" />
              </div>
              <span className="text-[#00D9FF] font-mono text-sm tracking-widest">YOU</span>
            </div>

            {/* The Cut Line */}
            <div className="flex-1 h-px bg-[#00D9FF]/30 relative w-32">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-8 h-8 rounded-full bg-[#0A1929] border border-[#00D9FF] text-[#00D9FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]">
                   <Lock size={14} />
                 </div>
              </div>
            </div>

            {/* Cloud Node */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-40 border-4 border-[#00D9FF] rounded-[2rem] bg-[#0A1929] flex items-center justify-center relative shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                 <div className="text-xs text-[#00D9FF] font-mono">VAULT</div>
              </div>
              <span className="text-[#00D9FF] font-mono text-sm tracking-widest">CORE</span>
            </div>
          </motion.div>

          {/* Copy */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Fortress Architecture.</h2>
          
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto mb-16">
            We use high-performance cloud processing to run AI models your phone can't handle. But we treat your data like a Swiss vault: Encrypted in transit. Isolated in storage. Incinerated on deletion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             {[
               { icon: Lock, title: "Encrypted Transit", desc: "Your data travels through a secure, encrypted tunnel directly to our isolated processing core." },
               { icon: Smartphone, title: "The Kill Switch", desc: "Delete your account, and we trigger a hard-delete on our database. No soft backups. Gone is gone." },
               { icon: Ban, title: "No Ad Business", desc: "We sell intelligence, not user profiles. You are the customer, not the product." }
             ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#94A3B8] mb-4" />
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{feature.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FOUNDER */}
      <section className="py-32 px-6 bg-[#050C14]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Avatar Area */}
          <div className="mb-10 relative">
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00D9FF] to-blue-600 p-[2px]">
               <div className="w-full h-full rounded-full bg-[#0A1929] flex items-center justify-center overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                 {/* Abstract "User" representation since no photo provided */}
                 <div className="w-full h-full bg-[#00D9FF]/10 flex items-center justify-center">
                    <Activity size={40} className="text-[#00D9FF]" />
                 </div>
               </div>
             </div>
          </div>

          {/* Quote - Sans Serif per request */}
          <h2 className="font-display text-2xl md:text-4xl font-medium text-white leading-[1.15] mb-12 tracking-tight">
            "I built JARVIS because I kept burning out. Every app tracked parts of my life. Nothing connected the dots.
            This is the first thing that kept me in the game for 2 years straight."
          </h2>

          {/* Signature Block */}
          <div className="flex flex-col items-center gap-4">
            {/* Signature Effect */}
            <div className="text-4xl text-[#00D9FF] -rotate-6 tracking-wide" style={{ fontFamily: '"Brush Script MT", cursive' }}>
              Swapnil
            </div>
            
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="text-xs text-[#94A3B8] uppercase tracking-widest font-mono">Founder, Jarvis</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="py-32 text-center border-t border-white/5 bg-[#050C14] relative overflow-hidden">
        {/* Glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#00D9FF] blur-[150px] opacity-10 rounded-full pointer-events-none" />

        <div className="relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLogoClicks(prev => prev + 1)}
            className="w-16 h-16 bg-[#00D9FF] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,217,255,0.3)] cursor-pointer select-none"
          >
            <span className="font-display font-bold text-3xl text-[#0A1929]">J</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-12 font-display tracking-tight hover:text-[#00D9FF] transition-colors duration-500 cursor-default">
            Stay in the game.
          </h2>
          
          <button 
             onClick={() => router.push('/dashboard')}
             className="px-12 py-6 bg-[#00D9FF] text-[#0A1929] rounded-full font-bold text-xl hover:scale-105 hover:shadow-[0_0_60px_rgba(0,217,255,0.5)] transition-all duration-300"
          >
            DOWNLOAD JARVIS
          </button>
          
          <div className="mt-12 flex justify-center gap-8 text-[#94A3B8] text-sm">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Manifesto</a>
            <a href="#" className="hover:text-white transition-colors">Email</a>
          </div>
        </div>
      </footer>
      {/* EASTER EGG TERMINAL */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center font-mono p-4"
            onClick={() => setShowTerminal(false)}
          >
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-2xl w-full border border-[#00D9FF] bg-[#0A1929] p-8 rounded-lg shadow-[0_0_50px_rgba(0,217,255,0.3)] relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00D9FF]" />
                <div className="flex gap-2 mb-8 opacity-50">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                <div className="space-y-4 text-xl md:text-2xl text-[#00D9FF] min-h-[100px]">
                   <p className="whitespace-pre-wrap leading-relaxed">{typedText}</p>
                   {typedText.length > 5 && (
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-3 h-6 bg-[#00D9FF] ml-1 align-middle" 
                      />
                   )}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-xs text-[#94A3B8] flex justify-between font-mono">
                   <span>ID: USER_{Math.floor(Math.random() * 9999)}</span>
                   <span>ENCRYPTION: 256-BIT // SECURE</span>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
      </ReactLenis>
    </CursorContext.Provider>
  );
};
