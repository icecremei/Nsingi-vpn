
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING'
}

export interface VPNSession {
  startTime: number;
  uploadSpeed: number; // in Mbps
  downloadSpeed: number; // in Mbps
  totalData: number; // in MB
  ipAddress: string;
}

export interface VPNServer {
  id: string;
  country: string;
  city: string;
  load: number;
  latency: number;
  flag: string;
  coordinates: [number, number]; // [lat, lng]
  isPremium?: boolean;
}

export interface SecurityAlert {
  id: string;
  type: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: number;
}
