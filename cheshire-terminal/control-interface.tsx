import {
    useEffect,
    useState,
} from "react";

import {
    Bot,
    BrainCircuit,
    Camera,
    Cpu,
    Mail,
    Monitor,
    Twitter,
    Webhook,
    Zap,
} from "lucide-react";
import type { NextPage } from "next";

import {
    Connection,
    PublicKey,
} from "@solana/web3.js";

const GRIN_TOKEN = new PublicKey('7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE');

interface CheshireStatus {
  llama: boolean;
  openai: boolean;
  firecrawl: boolean;
  twitter: boolean;
}

interface CheshireConfig {
  imageGeneration: boolean;
  timelineScraping: boolean;
  mentionResponse: boolean;
  tweetInterval: number;
}

const Home: NextPage = () => {
  const [clusterStatus, setClusterStatus] = useState({
    macMini: 'connecting',
    macbookAir: 'connecting',
    neural: 'initializing',
    agent: 'connecting'
  });

  const [cheshireStatus, setCheshireStatus] = useState<CheshireStatus>({
    llama: false,
    openai: false,
    firecrawl: false,
    twitter: false
  });

  const [cheshireConfig, setCheshireConfig] = useState<CheshireConfig>({
    imageGeneration: false,
    timelineScraping: false,
    mentionResponse: false,
    tweetInterval: 3600
  });

  const [agentMetrics, setAgentMetrics] = useState({
    status: 'unknown',
    type: '',
    connections: {
      elevenlabs: 'unknown',
      websocket: 'unknown'
    },
    uptime: 0
  });

  const [systemMetrics, setSystemMetrics] = useState({
    totalTflops: 0,
    activeNodes: 0,
    grinBalance: 0
  });

  useEffect(() => {
    const pollStatus = async () => {
      try {
        // Check Mac Mini status
        const miniResponse = await fetch('http://compute-primary:8001/status');
        
        // Check MacBook Air status
        const airResponse = await fetch('http://compute-aux:8001/status');
        
        // Check Conversational Agent status
        const agentResponse = await fetch('http://localhost:8000/status')
          .then(res => res.json())
          .catch(() => null);

        // Check Cheshire Bot status
        const cheshireResponse = await fetch('http://localhost:3001/status')
          .then(res => res.json())
          .catch(() => ({
            services: { llama: false, openai: false, firecrawl: false, twitter: false },
            config: {
              imageGeneration: false,
              timelineScraping: false,
              mentionResponse: false,
              tweetInterval: 3600
            }
          }));
        
        // Update cluster status
        setClusterStatus({
          macMini: miniResponse.ok ? 'connected' : 'error',
          macbookAir: airResponse.ok ? 'connected' : 'error',
          neural: 'active',
          agent: agentResponse ? 'active' : 'error'
        });

        // Update Cheshire status and config
        setCheshireStatus(cheshireResponse.services);
        setCheshireConfig(cheshireResponse.config);

        // Update agent metrics if available
        if (agentResponse) {
          setAgentMetrics(agentResponse);
        }

        // Get system metrics
        const metrics = await getSystemMetrics();
        setSystemMetrics(metrics);
      } catch (error) {
        console.error('Quantum fluctuation detected:', error);
      }
    };

    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSystemMetrics = async () => {
    const connection = new Connection('http://localhost:8899', 'confirmed');
    
    // Get $GRIN token balance
    const balance = await connection.getBalance(GRIN_TOKEN);

    return {
      totalTflops: 87.0, // Combined TFLOPS
      activeNodes: Object.values(clusterStatus).filter(s => s === 'connected' || s === 'active').length,
      grinBalance: balance / 1e9 // Convert lamports to SOL
    };
  };

  const toggleCheshireFeature = async (feature: keyof CheshireConfig) => {
    try {
      const response = await fetch('http://localhost:3001/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [feature]: !cheshireConfig[feature]
        })
      });
      
      if (response.ok) {
        const newConfig = await response.json();
        setCheshireConfig(newConfig);
      }
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-500">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-mono mb-2">Cheshire Terminal</h1>
          <p className="text-xl font-mono text-green-400">Control Center</p>
        </header>

        {/* Cluster Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          {/* Conversational Agent Status */}
          <div className={`bg-gray-800 p-6 rounded-lg border-2
            ${clusterStatus.agent === 'active' ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <Bot className="w-8 h-8" />
              <h3 className="text-lg">Agent Interface</h3>
            </div>
            <p>Status: {agentMetrics.status}</p>
            <p>ElevenLabs: {agentMetrics.connections.elevenlabs}</p>
            <p>WebSocket: {agentMetrics.connections.websocket}</p>
            <p>Uptime: {Math.floor(agentMetrics.uptime)}s</p>
          </div>
        </div>

        {/* Cheshire Bot Status */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl mb-4">Cheshire Bot Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Text Generation Status */}
            <div className={`p-4 rounded-lg border-2 ${cheshireStatus.llama ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <BrainCircuit className="w-6 h-6" />
                <span>Text Generation</span>
              </div>
              <p>{cheshireStatus.llama ? 'Active' : 'Inactive'}</p>
            </div>

            {/* Image Generation Status */}
            <div className={`p-4 rounded-lg border-2 ${cheshireStatus.openai ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <Camera className="w-6 h-6" />
                <span>Image Generation</span>
              </div>
              <p>{cheshireStatus.openai ? 'Active' : 'Inactive'}</p>
            </div>

            {/* Web Scraping Status */}
            <div className={`p-4 rounded-lg border-2 ${cheshireStatus.firecrawl ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <Webhook className="w-6 h-6" />
                <span>Web Scraping</span>
              </div>
              <p>{cheshireStatus.firecrawl ? 'Active' : 'Inactive'}</p>
            </div>

            {/* Twitter Status */}
            <div className={`p-4 rounded-lg border-2 ${cheshireStatus.twitter ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <Twitter className="w-6 h-6" />
                <span>Twitter Bot</span>
              </div>
              <p>{cheshireStatus.twitter ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>

        {/* Cheshire Bot Configuration */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl mb-4">Bot Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button
              type="button"
              onClick={() => toggleCheshireFeature('imageGeneration')}
              className={`p-4 rounded-lg ${
                cheshireConfig.imageGeneration ? 'bg-green-600' : 'bg-gray-700'
              } hover:opacity-90 transition`}
            >
              <Camera className="w-6 h-6 mb-2" />
              Image Generation
            </button>

            <button
              type="button"
              onClick={() => toggleCheshireFeature('timelineScraping')}
              className={`p-4 rounded-lg ${
                cheshireConfig.timelineScraping ? 'bg-green-600' : 'bg-gray-700'
              } hover:opacity-90 transition`}
            >
              <Webhook className="w-6 h-6 mb-2" />
              Timeline Scraping
            </button>

            <button
              type="button"
              onClick={() => toggleCheshireFeature('mentionResponse')}
              className={`p-4 rounded-lg ${
                cheshireConfig.mentionResponse ? 'bg-green-600' : 'bg-gray-700'
              } hover:opacity-90 transition`}
            >
              <Mail className="w-6 h-6 mb-2" />
              Mention Response
            </button>

            <div className="p-4 rounded-lg bg-gray-700">
              <p className="text-sm mb-2">Tweet Interval</p>
              <p className="text-xl">{cheshireConfig.tweetInterval / 60} min</p>
            </div>
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
        <div className="grid grid-cols-3 gap-6">
          <button 
            type="button"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition"
            onClick={() => console.log('Start cluster')}
          >
            Initialize Quantum State
          </button>
          <button 
            type="button"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => window.open('http://localhost:8000', '_blank')}
          >
            Open Agent Interface
          </button>
          <button 
            type="button"
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
