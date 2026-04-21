import mitt, { Emitter } from 'mitt';
import type { WormInstance } from '../types';

interface EventMap {
  'worm:spawned': WormInstance;
  'worm:died': { pid: number };
  'worm:update': WormInstance;
  'system:weather': { weatherState: 'clear' | 'cloudy' | 'storm'; loadAvg: number };
}

class EventBridgeClass {
  private emitter: Emitter<EventMap>;

  constructor() {
    this.emitter = mitt<EventMap>();
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.emitter.emit(event, data);
  }

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    this.emitter.on(event, handler);
  }

  off<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    this.emitter.off(event, handler);
  }
}

export const EventBridge = new EventBridgeClass();
