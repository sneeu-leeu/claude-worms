import { useEffect } from 'react';
import { getSocket } from './SocketClient';
import { useWormStore } from '../store/useWormStore';
import { useSystemStore } from '../store/useSystemStore';
import { EventBridge } from '../game/EventBridge';

export function useSocketEvents(): void {
  useEffect(() => {
    const socket = getSocket();

    // Worm spawned
    socket.on('worm:spawned', (worm) => {
      console.log('Worm spawned:', worm);
      useWormStore.getState().addWorm(worm);
      EventBridge.emit('worm:spawned', worm);
    });

    // Worm died
    socket.on('worm:died', (data: { pid: number; sessionId: string }) => {
      console.log('Worm died:', data.sessionId);
      useWormStore.getState().removeWorm(data.pid);
      EventBridge.emit('worm:died', { pid: data.pid });
    });

    // Worm activity/update
    socket.on('worm:activity', (data) => {
      const updatedWorm = {
        pid: data.pid,
        lastOutput: data.lastOutput,
        health: data.health,
        status: data.status,
        currentTask: data.currentTask,
      } as any;
      useWormStore.getState().updateWorm(updatedWorm);
      EventBridge.emit('worm:update', updatedWorm);
    });

    // System weather update
    socket.on('system:weather', (data) => {
      useSystemStore.getState().setWeather(data);
      EventBridge.emit('system:weather', data);
    });

    return () => {
      socket.off('worm:spawned');
      socket.off('worm:died');
      socket.off('worm:activity');
      socket.off('system:weather');
    };
  }, []);
}
