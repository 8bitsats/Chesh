import {
    useEffect,
    useState,
} from "react";

import {
    Cpu,
    Monitor,
    Zap,
} from "lucide-react";
import type { NextPage } from "next/types";

import {
    Connection,
    PublicKey,
} from "@solana/web3.js";

const GRIN_TOKEN = new PublicKey('7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE');

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
      const connection = new Connection('http://localhost:8899', 'confirmed');
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

  return (
    <div className="min-h-screen bg-gray-900 text-green-500">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-mono mb-2">Cheshire Terminal</h1>
          <p className="text-xl font-mono text-green-400">Control Center</p>
        </header>

        {/* Cluster Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Mac Mini Status */}
          <div className={`bg-gray-800 p-6 rounded-lg border-2 
            ${clusterStatus.macMini === 'connected' ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <Cpu className="w-8 h-8" />
              <h3 className="text-lg">Primary Compute</h3>
            </div>
            <p>Status: {clusterStatus.macMini}</p>
            <p>44.0 TFLOPS</p>
          </div>

          {/* MacBook Air Status */}
          <div className={`bg-gray-800 p-6 rounded-lg border-2
            ${clusterStatus.macbookAir === 'connected' ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <Monitor className="w-8 h-8" />
              <h3 className="text-lg">Auxiliary Compute</h3>
            </div>
            <p>Status: {clusterStatus.macbookAir}</p>
            <p>10.6 TFLOPS</p>
          </div>

          {/* Neural Network Status */}
          <div className={`bg-gray-800 p-6 rounded-lg border-2
            ${clusterStatus.neural === 'active' ? 'border-green-500' : 'border-yellow-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8" />
              <h3 className="text-lg">Neural Network</h3>
            </div>
            <p>Status: {clusterStatus.neural}</p>
            <p>MLX Optimized</p>
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl mb-4">System Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm">Total Performance</p>
              <p className="text-2xl">{systemMetrics.totalTflops} TFLOPS</p>
            </div>
            <div>
              <p className="text-sm">Active Nodes</p>
              <p className="text-2xl">{systemMetrics.activeNodes}</p>
            </div>
            <div>
              <p className="text-sm">$GRIN Balance</p>
              <p className="text-2xl">{systemMetrics.grinBalance}</p>
            </div>
          </div>
        </div>

        {/* Control Actions */}
        <div className="grid grid-cols-2 gap-6">
          <button 
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition"
            onClick={() => console.log('Start cluster')}
          >
            Initialize Quantum State
          </button>
          <button 
            className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition"
            onClick={() => console.log('Stop cluster')}
          >
            Collapse Quantum State
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
