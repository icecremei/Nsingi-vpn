
import React from 'react';
import { VPNServer } from '../types';

interface ServerItemProps {
  server: VPNServer;
  isSelected: boolean;
  onClick: () => void;
}

const ServerItem: React.FC<ServerItemProps> = ({ server, isSelected, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
        isSelected 
          ? 'bg-zinc-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
          : 'bg-transparent border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{server.flag}</span>
        <div className="text-left">
          <p className="text-sm font-medium text-white">{server.city}</p>
          <p className="text-xs text-zinc-500">{server.country}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full ${server.load > 80 ? 'bg-red-500' : server.load > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className="text-[10px] text-zinc-400">{server.load}%</span>
        </div>
        <span className="text-[10px] text-zinc-500">{server.latency}ms</span>
      </div>
    </button>
  );
};

export default ServerItem;
