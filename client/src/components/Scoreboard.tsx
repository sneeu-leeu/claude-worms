import React from 'react';
import { useWormStore } from '../store/useWormStore';

export function Scoreboard() {
  const worms = useWormStore((state) => state.getAllWorms());

  if (worms.length === 0) {
    return null;
  }

  const totalMessages = worms.reduce((sum, w) => sum + w.messageCount, 0);
  const avgHealth = Math.round(worms.reduce((sum, w) => sum + w.health, 0) / worms.length);
  const totalUptime = worms.reduce((sum, w) => sum + w.uptime, 0);

  const sortedByHealth = [...worms].sort((a, b) => b.health - a.health);
  const sortedByMessages = [...worms].sort((a, b) => b.messageCount - a.messageCount);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-t-4 border-yellow-400 p-4 pixel-scanlines">
      <div className="grid grid-cols-4 gap-8 text-xs max-w-full overflow-x-auto pixel-text">
        <div className="text-center">
          <div className="text-gray-500 mb-2">MESSAGES</div>
          <div className="text-2xl font-bold retro-green">{totalMessages}</div>
        </div>

        <div className="text-center">
          <div className="text-gray-500 mb-2">AVG HEALTH</div>
          <div className="text-2xl font-bold retro-cyan">{avgHealth}%</div>
        </div>

        <div className="text-center">
          <div className="text-gray-500 mb-2">STRONGEST</div>
          <div className="text-lg font-bold retro-yellow">
            {sortedByHealth[0]?.cwd.split('/').pop() || 'N/A'}
          </div>
        </div>

        <div className="text-center">
          <div className="text-gray-500 mb-2">ACTIVE</div>
          <div className="text-lg font-bold retro-cyan">
            {sortedByMessages[0]?.cwd.split('/').pop() || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
