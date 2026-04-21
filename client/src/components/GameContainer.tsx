import React, { useEffect } from 'react';

export function GameContainer() {
  useEffect(() => {
    // Phaser will be initialized here in Phase 3
    const container = document.getElementById('game-container');
    if (!container) return;

    // Placeholder for now - will contain Phaser game initialization
    container.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 18px;">Game Canvas (Phaser 3 - coming soon)</div>';

    return () => {
      // Cleanup will happen when Phaser is integrated
    };
  }, []);

  return (
    <div
      id="game-container"
      className="flex-1 bg-gradient-to-b from-blue-200 to-blue-100"
    />
  );
}
