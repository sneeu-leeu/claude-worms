import React from 'react';
import type { WormInstance } from '../types';
import { useWormStore } from '../store/useWormStore';

interface WormCardProps {
  worm: WormInstance;
}

export function WormCard({ worm }: WormCardProps) {
  const { selectWorm, setSpectating } = useWormStore();
  const selectedWormPid = useWormStore((state) => state.selectedWormPid);

  const uptime = Math.floor(worm.uptime / 1000);
  const minutes = Math.floor(uptime / 60);
  const seconds = uptime % 60;
  const uptimeStr = `${minutes}m ${seconds}s`;

  const statusColor = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    sleeping: 'bg-gray-500',
    dead: 'bg-red-500',
    waiting: 'bg-blue-500',
  }[worm.status];

  const handleKill = async (signal: 'SIGTERM' | 'SIGKILL' | 'SIGHUP' = 'SIGTERM') => {
    try {
      const response = await fetch(`/api/instances/${worm.pid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal }),
      });

      if (response.ok) {
        console.log('Worm killed');
      }
    } catch (err) {
      console.error('Error killing worm:', err);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSpectate = () => {
    setSpectating(worm.pid);
  };

  const handleFocus = async () => {
    try {
      await fetch(`/api/instances/${worm.pid}/focus`, { method: 'POST' });
    } catch (err) {
      console.error('Error focusing tab:', err);
    }
  };

  const healthColor = worm.health > 50 ? 'retro-green' : worm.health > 25 ? 'retro-yellow' : 'retro-red';

  return (
    <div
      className={`p-3 mb-2 border-2 cursor-pointer transition pixel-border ${
        selectedWormPid === worm.pid ? 'border-yellow-400 bg-gray-800' : 'border-green-600 bg-gray-900 hover:bg-gray-800'
      }`}
      onClick={() => selectWorm(worm.pid)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-xs retro-green pixel-text">
            {worm.cwd.split('/').pop() || 'CLAUDE'}
          </h3>
          <p className="text-xs text-gray-500">{worm.sessionId.slice(0, 8)}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold pixel-text border border-current ${
            worm.status === 'active'
              ? 'retro-green'
              : worm.status === 'idle'
                ? 'retro-yellow'
                : 'text-gray-500'
          }`}
        >
          {worm.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 pixel-text">HP</span>
          <span className={`text-xs font-semibold pixel-text ${healthColor}`}>{Math.round(worm.health)}%</span>
        </div>
        <div className="w-full bg-gray-800 border border-gray-600 h-2">
          <div
            className={`h-2 transition-all ${healthColor.replace('retro-', 'bg-')}`}
            style={{ width: `${worm.health}%`, background: healthColor === 'retro-green' ? '#00ff00' : healthColor === 'retro-yellow' ? '#ffff00' : '#ff0000' }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-2 truncate pixel-text">&gt; {worm.currentTask}</p>

      <p className="text-xs text-gray-500 mb-3 pixel-text">UP: {uptimeStr}</p>

      <div className="flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFocus();
          }}
          className="text-xs pixel-button bg-blue-600 text-white flex-1"
        >
          FOCUS
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSpectate();
          }}
          className="text-xs pixel-button bg-purple-600 text-white flex-1"
        >
          VIEW
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleKill('SIGTERM');
          }}
          className="text-xs pixel-button bg-red-600 text-white flex-1"
        >
          KILL
        </button>
      </div>
    </div>
  );
}
