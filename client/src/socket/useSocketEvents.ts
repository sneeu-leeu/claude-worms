import { useEffect } from 'react';
import { getSocket } from './SocketClient';
import { useWormStore } from '../store/useWormStore';
import { useSystemStore } from '../store/useSystemStore';

export function useSocketEvents(): void {
  useEffect(() => {
    const socket = getSocket();

    // Worm spawned
    socket.on('worm:spawned', (worm) => {
      console.log('Worm spawned:', worm);
      useWormStore.getState().addWorm(worm);
    });

    // Worm died
    socket.on('worm:died', (data: { pid: number; sessionId: string }) => {
      console.log('Worm died:', data.sessionId);
      useWormStore.getState().removeWorm(data.pid);
    });

    // Worm activity/update
    socket.on('worm:activity', (data) => {
      useWormStore.getState().updateWorm({
        pid: data.pid,
        lastOutput: data.lastOutput,
        health: data.health,
        status: data.status,
        currentTask: data.currentTask,
      } as any);
    });

    // System weather update
    socket.on('system:weather', (data) => {
      useSystemStore.getState().setWeather(data);
    });

    return () => {
      socket.off('worm:spawned');
      socket.off('worm:died');
      socket.off('worm:activity');
      socket.off('system:weather');
    };
  }, []);
}
