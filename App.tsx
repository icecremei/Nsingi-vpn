
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ConnectionStatus, 
  VPNServer, 
  VPNSession, 
  SecurityAlert 
} from './types';
import { MOCK_SERVERS, APP_NAME } from './constants';
import WorldMap from './components/WorldMap';
import TrafficChart from './components/TrafficChart';
import ServerItem from './components/ServerItem';
import { getSecurityAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [selectedServer, setSelectedServer] = useState<VPNServer>(MOCK_SERVERS[0]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [securityAdvice, setSecurityAdvice] = useState<string>("Initializing security protocols...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [session, setSession] = useState<VPNSession | null>(null);

  // Generate real-time traffic data
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === ConnectionStatus.CONNECTED) {
        setTrafficData(prev => {
          const newData = [...prev, {
            time: new Date().toLocaleTimeString(),
            upload: Math.random() * 5 + 1,
            download: Math.random() * 25 + 5
          }].slice(-20);
          return newData;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Fetch AI Security advice when server changes
  useEffect(() => {
    const fetchAdvice = async () => {
      setSecurityAdvice("Analyzing server security...");
      const advice = await getSecurityAdvice(selectedServer);
      setSecurityAdvice(advice || "");
    };
    fetchAdvice();
  }, [selectedServer]);

  const toggleConnection = () => {
    if (status === ConnectionStatus.DISCONNECTED) {
      setStatus(ConnectionStatus.CONNECTING);
      setTimeout(() => {
        setStatus(ConnectionStatus.CONNECTED);
        setSession({
          startTime: Date.now(),
          uploadSpeed: 0,
          downloadSpeed: 0,
          totalData: 0,
          ipAddress: `185.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.12`
        });
      }, 2000);
    } else if (status === ConnectionStatus.CONNECTED) {
      setStatus(ConnectionStatus.DISCONNECTING);
      setTimeout(() => {
        setStatus(ConnectionStatus.DISCONNECTED);
        setSession(null);
        setTrafficData([]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Sidebar - Server List */}
      <aside className={`w-80 h-full border-r border-zinc-900 bg-[#050505] flex flex-col transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-900 flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase italic">{APP_NAME}</h1>
        </div>

        <div className="p-4 bg-zinc-950/50">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search locations..." 
              className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-10 text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-2">Free Servers</div>
          {MOCK_SERVERS.map(server => (
            <ServerItem 
              key={server.id} 
              server={server} 
              isSelected={selectedServer.id === server.id}
              onClick={() => setSelectedServer(server)}
            />
          ))}
        </div>

        <div className="p-6 bg-zinc-950 border-t border-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>Protocol</span>
            <span className="text-zinc-300">OpenVPN (UDP)</span>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Kill Switch</span>
            <span className="text-red-500 font-bold uppercase">Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Header Bar */}
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-black/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <span className="text-zinc-500">Current Location:</span>
              <span className="text-white flex items-center">
                {selectedServer.flag} <span className="ml-2">{selectedServer.city}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${status === ConnectionStatus.CONNECTED ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter">
                    {status === ConnectionStatus.CONNECTED ? 'Live Security Shield' : 'No Active Shield'}
                </span>
             </div>
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-zinc-700">
                JD
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dashboard Left / Middle (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* World Map Component */}
            <div className="h-[450px] relative">
               <WorldMap 
                  servers={MOCK_SERVERS} 
                  selectedServer={selectedServer} 
                  onSelectServer={setSelectedServer}
                  isConnected={status === ConnectionStatus.CONNECTED}
                />
            </div>

            {/* AI Security Advisor Section */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4">
                  <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/30">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
               </div>
               <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">AI Security Advisor</h3>
               <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl font-mono">
                 "{securityAdvice}"
               </p>
               <div className="mt-4 flex space-x-4">
                  <button className="text-[10px] uppercase font-bold bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded transition-all">Enable Secure Core</button>
                  <button className="text-[10px] uppercase font-bold text-red-500 border border-red-900/50 hover:bg-red-900/10 px-3 py-1.5 rounded transition-all">Audit Traffic</button>
               </div>
            </div>

            {/* Traffic Visualization */}
            {status === ConnectionStatus.CONNECTED && (
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Real-time Traffic</h3>
                   <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs text-zinc-400">Upload</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="text-xs text-zinc-400">Download</span>
                      </div>
                   </div>
                </div>
                <TrafficChart data={trafficData} />
              </div>
            )}
          </div>

          {/* Right Sidebar - Status & Controls */}
          <div className="space-y-6">
            {/* Main Toggle Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_100%)]" />
                
                <h2 className={`text-xl font-bold uppercase tracking-tighter mb-8 ${status === ConnectionStatus.CONNECTED ? 'text-red-500' : 'text-zinc-600'}`}>
                    {status.replace('_', ' ')}
                </h2>

                <button 
                  onClick={toggleConnection}
                  disabled={status === ConnectionStatus.CONNECTING || status === ConnectionStatus.DISCONNECTING}
                  className={`group relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    status === ConnectionStatus.CONNECTED 
                    ? 'bg-red-600 shadow-[0_0_50px_rgba(239,68,68,0.4)] hover:shadow-[0_0_70px_rgba(239,68,68,0.6)]' 
                    : 'bg-zinc-800 hover:bg-zinc-700 shadow-none'
                  }`}
                >
                  <svg className={`w-12 h-12 text-white transition-transform duration-500 ${status === ConnectionStatus.CONNECTED ? 'scale-110' : 'scale-90 group-hover:scale-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  
                  {/* Outer Rings Animation */}
                  {status === ConnectionStatus.CONNECTED && (
                    <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping opacity-20" />
                  )}
                </button>

                <div className="mt-8 space-y-4 w-full">
                  <div className="p-4 bg-black/40 rounded-xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Assigned IP</p>
                    <p className="font-mono text-sm text-white">{session?.ipAddress || '127.0.0.1 (Local)'}</p>
                  </div>
                </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Latency</p>
                    <p className="text-xl font-bold text-white">{selectedServer.latency}<span className="text-[10px] font-normal text-zinc-500 ml-1">ms</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Load</p>
                    <p className="text-xl font-bold text-white">{selectedServer.load}<span className="text-[10px] font-normal text-zinc-500 ml-1">%</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Uptime</p>
                    <p className="text-xl font-bold text-white">99.9<span className="text-[10px] font-normal text-zinc-500 ml-1">%</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Encryption</p>
                    <p className="text-xl font-bold text-white">AES<span className="text-[10px] font-normal text-zinc-500 ml-1">256</span></p>
                  </div>
                </div>
            </div>

            {/* Shield Upgrade Card */}
            <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6">
                <h4 className="text-xs font-bold text-red-500 uppercase mb-2">Upgrade to Pro</h4>
                <p className="text-xs text-zinc-400 mb-4">Unlock 2000+ servers and specialized streaming modes.</p>
                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-lg transition-all shadow-[0_4px_15px_rgba(239,68,68,0.2)]">
                   GO UNLIMITED
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
