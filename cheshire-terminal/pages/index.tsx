import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Cpu,
    Monitor,
    Terminal,
    Zap,
} from "lucide-react";
import type { NextPage } from "next/types";

import {
    clusterApiUrl,
    Connection,
    PublicKey,
} from "@solana/web3.js";

import { SolanaTrader } from "../components/SolanaTrader";

const GRIN_TOKEN = new PublicKey('7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE');

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$>_";
    const fontSize = Math.max(10, Math.floor(window.innerWidth / 100));
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

const Home: NextPage = () => {
  const [clusterStatus, setClusterStatus] = useState({
    macMini: 'connecting',
    macbookAir: 'connecting',
    neural: 'initializing'
  });

  const [systemMetrics, setSystemMetrics] = useState({
    totalTflops: 0,
    activeNodes: 0,
    grinBalance: 0
  });

  const [consoleOutput, setConsoleOutput] = useState<Array<{id: string, text: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTradingActive, setIsTradingActive] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addToConsole = useCallback((message: string) => {
    const newEntry = {
      id: crypto.randomUUID(),
      text: message
    };
    setConsoleOutput(prev => [...prev, newEntry]);
    scrollToBottom();
  }, [scrollToBottom]);

  const traderRef = useRef(SolanaTrader({ onLog: addToConsole }));

  useEffect(() => {
    if (consoleEndRef.current) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  useEffect(() => {
    const pollClusterStatus = async () => {
      try {
        // Check Mac Mini status
        const miniResponse = await fetch('http://localhost:8001/status')
          .catch(() => ({ ok: false }));
        
        // Check MacBook Air status
        const airResponse = await fetch('http://localhost:8002/status')
          .catch(() => ({ ok: false }));
        
        // Update cluster status
        setClusterStatus({
          macMini: miniResponse.ok ? 'connected' : 'error',
          macbookAir: airResponse.ok ? 'connected' : 'error',
          neural: 'active'
        });

        // Get system metrics
        const metrics = await getSystemMetrics();
        setSystemMetrics(metrics);
      } catch (error) {
        console.error('Quantum fluctuation detected:', error);
      }
    };

    pollClusterStatus(); // Initial call
    const interval = setInterval(pollClusterStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSystemMetrics = async () => {
    let balance = 0;
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'));
      try {
        // Get $GRIN token balance - wrapped in its own try-catch
        balance = await connection.getBalance(GRIN_TOKEN);
      } catch (balanceError) {
        console.error('Failed to fetch GRIN balance:', balanceError);
        // Keep balance as 0
      }
    } catch (error) {
      console.error('Error connecting to Solana:', error);
    }

    return {
      totalTflops: 87.0, // Combined TFLOPS
      activeNodes: Object.values(clusterStatus).filter(s => s === 'connected').length,
      grinBalance: balance / 1e9 // Convert lamports to SOL
    };
  };

  const handleStartTrading = useCallback(() => {
    traderRef.current.startTrading();
    setIsTradingActive(true);
  }, []);

  const handleStopTrading = useCallback(() => {
    traderRef.current.stopTrading();
    setIsTradingActive(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono relative">
      <MatrixRain />
      <style jsx global>{`
        @keyframes glow {
          0% { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
          50% { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
          100% { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 5px #00ff00; }
          50% { box-shadow: 0 0 20px #00ff00; }
          100% { box-shadow: 0 0 5px #00ff00; }
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
        }
        .status-connected {
          background: #00ff00;
          box-shadow: 0 0 10px #00ff00;
        }
        .status-error {
          background: #ff0000;
          box-shadow: 0 0 10px #ff0000;
        }
        .status-initializing {
          background: #ffff00;
          box-shadow: 0 0 10px #ffff00;
        }
        .console-line {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 0.5s steps(40, end);
        }
        .glow-text {
          animation: glow 2s ease-in-out infinite;
        }
        .terminal-btn {
          transition: all 0.3s ease;
          text-shadow: 0 0 5px #00ff00;
          box-shadow: 0 0 10px rgba(0,255,0,0.3);
          animation: pulse 2s infinite;
          background: rgba(0,0,0,0.7);
          border: 1px solid #00ff00;
          backdrop-filter: blur(5px);
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
        }
        .terminal-btn:hover {
          background: rgba(0,255,0,0.2);
          box-shadow: 0 0 20px rgba(0,255,0,0.5);
          text-shadow: 0 0 10px #00ff00;
        }
        .terminal-btn:disabled {
          opacity: 0.5;
          animation: none;
        }
        .glass-panel {
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          border: 1px solid #00ff00;
          box-shadow: 0 0 20px rgba(0,255,0,0.2);
        }
        @media (max-width: 768px) {
          .terminal-btn {
            font-size: 0.8rem;
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="container max-w-6xl mx-auto px-4 py-6 relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-2 glow-text">Cheshire Terminal</h1>
          <p className="text-lg md:text-xl opacity-80">Control Center</p>
        </header>

        {/* Cluster Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Mac Mini Status */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Cpu className="w-6 h-6" />
              <h3 className="text-base md:text-lg">Primary Compute</h3>
            </div>
            <p className="text-sm md:text-base">
              <span className={`status-indicator ${
                clusterStatus.macMini === 'connected' ? 'status-connected' : 'status-error'
              }`} />
              Status: {clusterStatus.macMini}
            </p>
            <p className="text-sm md:text-base">44.0 TFLOPS</p>
          </div>

          {/* MacBook Air Status */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Monitor className="w-6 h-6" />
              <h3 className="text-base md:text-lg">Auxiliary Compute</h3>
            </div>
            <p className="text-sm md:text-base">
              <span className={`status-indicator ${
                clusterStatus.macbookAir === 'connected' ? 'status-connected' : 'status-error'
              }`} />
              Status: {clusterStatus.macbookAir}
            </p>
            <p className="text-sm md:text-base">10.6 TFLOPS</p>
          </div>

          {/* Neural Network Status */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-6 h-6" />
              <h3 className="text-base md:text-lg">Neural Network</h3>
            </div>
            <p className="text-sm md:text-base">
              <span className={`status-indicator ${
                clusterStatus.neural === 'active' ? 'status-connected' : 'status-initializing'
              }`} />
              Status: {clusterStatus.neural}
            </p>
            <p className="text-sm md:text-base">MLX Optimized</p>
          </div>
        </div>

        {/* System Metrics */}
        <div className="glass-panel p-4 rounded-lg mb-6">
          <h3 className="text-lg md:text-xl mb-3 glow-text">System Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs md:text-sm opacity-80">Total Performance</p>
              <p className="text-lg md:text-xl">{systemMetrics.totalTflops} TFLOPS</p>
            </div>
            <div>
              <p className="text-xs md:text-sm opacity-80">Active Nodes</p>
              <p className="text-lg md:text-xl">{systemMetrics.activeNodes}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm opacity-80">$GRIN Balance</p>
              <p className="text-lg md:text-xl">{systemMetrics.grinBalance}</p>
            </div>
          </div>
        </div>

        {/* Console Output */}
        <div className="glass-panel p-4 rounded-lg mb-6 h-80 md:h-96 overflow-y-auto">
          <div className="flex items-center mb-3">
            <Terminal className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <h3 className="text-lg md:text-xl glow-text">AI Agent Console</h3>
          </div>
          {consoleOutput.map((entry) => (
            <div key={entry.id} className="console-line mb-2 whitespace-pre-wrap opacity-90 text-sm md:text-base">
              {entry.text}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>

        {/* Control Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            type="button"
            className="terminal-btn rounded-lg"
            onClick={handleStartTrading}
            disabled={isTradingActive}
          >
            Initialize Trading Bot
          </button>
          <button 
            type="button"
            className="terminal-btn rounded-lg"
            onClick={() => {
              addToConsole('\n🔄 Generating Solana program...');
              setIsGenerating(true);
              setTimeout(() => {
                addToConsole('❌ LM Studio connection required');
                setIsGenerating(false);
              }, 1000);
            }}
            disabled={isGenerating}
          >
            Generate Solana Program
          </button>
          <button 
            type="button"
            className="terminal-btn rounded-lg"
            onClick={handleStopTrading}
            disabled={!isTradingActive}
          >
            Stop Trading Bot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
