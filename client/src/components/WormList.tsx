import React, { useState } from 'react';
import { useWormStore } from '../store/useWormStore';
import { WormCard } from './WormCard';

export function WormList() {
  const [projectPath, setProjectPath] = useState('');
  const [showSpawnModal, setShowSpawnModal] = useState(false);
  const worms = useWormStore((state) => state.getAllWorms());

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectPath.trim()) return;

    try {
      const response = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPath: projectPath.trim() }),
      });

      if (response.ok) {
        setProjectPath('');
        setShowSpawnModal(false);
        console.log('Instance spawned');
      }
    } catch (err) {
      console.error('Error spawning instance:', err);
    }
  };

  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 overflow-y-auto">
      <div className="p-4 border-b border-gray-300">
        <h2 className="font-bold text-lg mb-4">Worms ({worms.length})</h2>

        <button
          onClick={() => setShowSpawnModal(true)}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold"
        >
          + Spawn
        </button>
      </div>

      {showSpawnModal && (
        <div className="p-4 border-b border-gray-300 bg-white">
          <form onSubmit={handleSpawn}>
            <label className="block text-sm font-semibold mb-2">Project Path</label>
            <input
              type="text"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              placeholder="/Users/you/projects/myapp"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-3 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Spawn
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSpawnModal(false);
                  setProjectPath('');
                }}
                className="flex-1 bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4">
        {worms.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">No worms yet. Spawn one!</p>
        ) : (
          worms.map((worm) => <WormCard key={worm.pid} worm={worm} />)
        )}
      </div>
    </div>
  );
}
