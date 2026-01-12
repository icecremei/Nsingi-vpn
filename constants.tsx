
import { VPNServer } from './types';

export const APP_NAME = "CrimsonGuard VPN";

export const MOCK_SERVERS: VPNServer[] = [
  { id: '1', country: 'United States', city: 'New York', load: 45, latency: 12, flag: '🇺🇸', coordinates: [40.7128, -74.0060] },
  { id: '2', country: 'Switzerland', city: 'Zurich', load: 22, latency: 45, flag: '🇨🇭', coordinates: [47.3769, 8.5417] },
  { id: '3', country: 'Japan', city: 'Tokyo', load: 88, latency: 120, flag: '🇯🇵', coordinates: [35.6762, 139.6503] },
  { id: '4', country: 'Germany', city: 'Frankfurt', load: 31, latency: 38, flag: '🇩🇪', coordinates: [50.1109, 8.6821] },
  { id: '5', country: 'Brazil', city: 'São Paulo', load: 12, latency: 15, flag: '🇧🇷', coordinates: [-23.5505, -46.6333] },
  { id: '6', country: 'Singapore', city: 'Singapore', load: 56, latency: 180, flag: '🇸🇬', coordinates: [1.3521, 103.8198] },
  { id: '7', country: 'United Kingdom', city: 'London', load: 67, latency: 25, flag: '🇬🇧', coordinates: [51.5074, -0.1278] },
  { id: '8', country: 'Australia', city: 'Sydney', load: 15, latency: 210, flag: '🇦🇺', coordinates: [-33.8688, 151.2093] },
];
