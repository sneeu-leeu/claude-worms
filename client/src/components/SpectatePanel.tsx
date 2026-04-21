import React from 'react';
import { useWormStore } from '../store/useWormStore';

export function SpectatePanel() {
  const spectatingWormPid = useWormStore((state) => state.spectatingWormPid);
  const worms = useWormStore((state) => state.getAllWorms());
  const spectatingWorm = spectatingWormPid ? worms.find((w) => w.pid === spectatingWormPid) : null;

  if (!spectatingWorm) {
    return null;
  }

  return (
    <div className="w-80 bg-gray-900 text-white border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{spectatingWorm.cwd.split('/').pop()}</h3>
            <p className="text-xs text-gray-400">{spectatingWorm.sessionId}</p>
          </div>
          <button
            onClick={() => useWormStore.getState().setSpectating(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-xs bg-gray-950">
        <div className="text-green-400"># Terminal output coming soon (Phase 4)</div>
        <div className="text-gray-500 mt-2">Last message: {spectatingWorm.lastOutput}</div>
      </div>
    </div>
  );
}
