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

  const handleKill = async () => {
    try {
      const response = await fetch(`/api/instances/${worm.pid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal: 'SIGTERM' }),
      });

      if (response.ok) {
        console.log('Worm killed');
      }
    } catch (err) {
      console.error('Error killing worm:', err);
    }
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

  return (
    <div
      className={`p-4 mb-2 border rounded cursor-pointer transition ${
        selectedWormPid === worm.pid
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:bg-gray-50'
      }`}
      onClick={() => selectWorm(worm.pid)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-sm">
            {worm.cwd.split('/').pop() || 'claude'}
          </h3>
          <p className="text-xs text-gray-600">{worm.sessionId.slice(0, 8)}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs text-white font-semibold ${statusColor}`}>
          {worm.status}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Health</span>
          <span className="text-xs font-semibold">{Math.round(worm.health)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-green-500 h-2 rounded transition-all"
            style={{ width: `${worm.health}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-700 mb-2 truncate">{worm.currentTask}</p>

      <p className="text-xs text-gray-500 mb-3">Uptime: {uptimeStr}</p>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFocus();
          }}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Focus
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSpectate();
          }}
          className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
        >
          Spectate
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleKill();
          }}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Kill
        </button>
      </div>
    </div>
  );
}
