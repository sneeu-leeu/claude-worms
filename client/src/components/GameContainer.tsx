import React, { useEffect } from 'react';
import { initializePhaserGame, destroyPhaserGame } from '../game/PhaserGame';
import { EventBridge } from '../game/EventBridge';
import { useWormStore } from '../store/useWormStore';

export function GameContainer() {
  useEffect(() => {
    const container = document.getElementById('game-container');
    if (!container) return;

    // Initialize Phaser game
    try {
      const game = initializePhaserGame(container);

      // Bridge React store updates to Phaser via EventBridge
      const handleWormAdded = (worm: any) => {
        EventBridge.emit('worm:spawned', worm);
      };

      const handleWormRemoved = (pid: number) => {
        EventBridge.emit('worm:died', { pid });
      };

      // Subscribe to store changes
      const unsubscribeAdd = useWormStore.subscribe(
        (state) => state.worms,
        (newWorms, oldWorms) => {
          // Find newly added worms
          for (const [pid, worm] of newWorms) {
            if (!oldWorms.has(pid)) {
              handleWormAdded(worm);
            } else {
              // Update existing worm
              EventBridge.emit('worm:update', worm);
            }
          }

          // Find removed worms
          for (const [pid] of oldWorms) {
            if (!newWorms.has(pid)) {
              handleWormRemoved(pid);
            }
          }
        },
      );

      return () => {
        unsubscribeAdd();
        destroyPhaserGame();
      };
    } catch (err) {
      console.error('Error initializing Phaser:', err);
    }
  }, []);

  return (
    <div
      id="game-container"
      className="flex-1 bg-gradient-to-b from-blue-200 to-blue-100"
      style={{ position: 'relative' }}
    />
  );
}
