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

  const loadColor =
    load1 < 2 ? 'retro-green' : load1 < 5 ? 'retro-yellow' : 'retro-red';

  return (
    <div className="h-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white flex items-center justify-between px-8 border-b-4 border-yellow-400 pixel-scanlines">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold pixel-glow">🪱 CLAUDE WORMS</h1>
        <div className="pixel-text text-xs">
          <div className="flex items-center gap-2">
            <span className="pixel-status active"></span>
            <span className={`${wormCount > 0 ? 'retro-green' : 'retro-red'}`}>{wormCount} WORMS</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12 text-xs pixel-text">
        <div className="text-center">
          <div className="text-gray-500 mb-1">LOAD AVG</div>
          <div className={loadColor}>{load1.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 mb-1">WEATHER</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{weatherIcon}</span>
            <span className="retro-cyan uppercase">{weatherState}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
