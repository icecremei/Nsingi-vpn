
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficData {
  time: string;
  upload: number;
  download: number;
}

interface TrafficChartProps {
  data: TrafficData[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '10px' }}
            itemStyle={{ color: '#ef4444' }}
          />
          <Area 
            type="monotone" 
            dataKey="upload" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorUpload)" 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="download" 
            stroke="#ffffff" 
            fillOpacity={1} 
            fill="url(#colorDownload)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
