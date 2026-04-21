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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white border-t border-gray-600 p-4">
      <div className="grid grid-cols-4 gap-8 text-sm max-w-full overflow-x-auto">
        <div>
          <div className="text-gray-400 text-xs">Total Messages</div>
          <div className="text-xl font-bold text-green-400">{totalMessages}</div>
        </div>

        <div>
          <div className="text-gray-400 text-xs">Avg Health</div>
          <div className="text-xl font-bold text-blue-400">{avgHealth}%</div>
        </div>

        <div>
          <div className="text-gray-400 text-xs">Healthiest Worm</div>
          <div className="text-lg font-bold text-yellow-400">
            {sortedByHealth[0]?.cwd.split('/').pop() || 'N/A'}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-xs">Most Active</div>
          <div className="text-lg font-bold text-purple-400">
            {sortedByMessages[0]?.cwd.split('/').pop() || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
