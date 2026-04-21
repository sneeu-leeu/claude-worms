import React from 'react';
import { useWormStore } from '../store/useWormStore';
import { useSystemStore } from '../store/useSystemStore';

export function SystemStatus() {
  const wormCount = useWormStore((state) => state.getAllWorms().length);
  const { load1, weatherState } = useSystemStore();

  const weatherIcon = {
    clear: '☀️',
    cloudy: '☁️',
    storm: '⛈️',
  }[weatherState];

  return (
    <div className="h-16 bg-gray-800 text-white flex items-center justify-between px-6 border-b border-gray-700">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold">🪱 Claude Worms</h1>
        <div className="text-sm">
          <span className="font-semibold">{wormCount}</span> worms active
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-gray-400">Load:</span>
          <span className="font-semibold ml-2">{load1.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-xl">{weatherIcon}</span>
          <span className="text-gray-400 ml-2 capitalize">{weatherState}</span>
        </div>
      </div>
    </div>
  );
}
