import { Server as SocketIOServer, Socket } from 'socket.io';
import { loadavg } from 'os';
import { config } from '../config.js';
import type { WormInstance, SocketEvents } from '../types.js';

export class SocketServer {
  private io: SocketIOServer;
  private weatherInterval: NodeJS.Timeout | null = null;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      socket.on('client:spectate', (data: { pid: number }) => {
        socket.emit('spectate:started', { pid: data.pid });
      });

      socket.on('client:spectate:stop', () => {
        socket.emit('spectate:stopped');
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  emit<K extends keyof SocketEvents>(event: K, data: SocketEvents[K]): void {
    this.io.emit(event, data);
  }

  startWeatherUpdates(): void {
    this.weatherInterval = setInterval(() => {
      const load = loadavg()[0];
      let weatherState: 'clear' | 'cloudy' | 'storm' = 'clear';

      if (load > 5) {
        weatherState = 'storm';
      } else if (load > 2) {
        weatherState = 'cloudy';
      }

      this.emit('system:weather', {
        loadAvg: load,
        weatherState,
      });
    }, config.SYSTEM_WEATHER_INTERVAL);
  }

  stop(): void {
    if (this.weatherInterval) {
      clearInterval(this.weatherInterval);
      this.weatherInterval = null;
    }
    this.io.close();
  }
}
