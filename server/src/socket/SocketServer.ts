import { Server as SocketIOServer, Socket } from 'socket.io';
import { loadavg } from 'os';
import { config } from '../config.js';
import { StreamController } from '../controller/StreamController.js';
import type { WormInstance, SocketEvents } from '../types.js';

export class SocketServer {
  private io: SocketIOServer;
  private weatherInterval: NodeJS.Timeout | null = null;
  private getInstances: (() => WormInstance[]) | null = null;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupHandlers();
  }

  setInstancesGetter(getter: () => WormInstance[]): void {
    this.getInstances = getter;
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      socket.on('client:spectate', (data: { pid: number }) => {
        if (!this.getInstances) {
          socket.emit('spectate:error', { message: 'Instances not available' });
          return;
        }

        const instances = this.getInstances();
        const worm = instances.find((w) => w.pid === data.pid);

        if (!worm) {
          socket.emit('spectate:error', { message: 'Worm not found' });
          return;
        }

        StreamController.startSpectate(socket, worm, this.getInstances);
      });

      socket.on('client:spectate:stop', () => {
        StreamController.stopSpectate(socket);
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
