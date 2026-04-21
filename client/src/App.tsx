import React, { useEffect, useState } from 'react';
import { initializeSocket } from './socket/SocketClient';
import { useSocketEvents } from './socket/useSocketEvents';
import { useWormStore } from './store/useWormStore';
import { SystemStatus } from './components/SystemStatus';
import { WormList } from './components/WormList';
import { GameContainer } from './components/GameContainer';
import { SpectatePanel } from './components/SpectatePanel';
import { WeaponMenu } from './components/WeaponMenu';
import { Scoreboard } from './components/Scoreboard';

function App() {
  useSocketEvents();
  const [weaponMenu, setWeaponMenu] = useState<{ pid: number; x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    // Initialize socket connection
    initializeSocket();

    // Fetch existing instances on mount
    const fetchInstances = async () => {
      try {
        const response = await fetch('/api/instances');
        if (response.ok) {
          const instances = await response.json();
          instances.forEach((worm: any) => {
            useWormStore.getState().addWorm(worm);
          });
        }
      } catch (err) {
        console.error('Error fetching instances:', err);
      }
    };

    fetchInstances();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <SystemStatus />

      <div className="flex flex-1 overflow-hidden">
        <WormList />
        <GameContainer />
        <SpectatePanel />
      </div>

      <Scoreboard />

      {weaponMenu && (
        <WeaponMenu
          pid={weaponMenu.pid}
          x={weaponMenu.x}
          y={weaponMenu.y}
          onClose={() => setWeaponMenu(null)}
        />
      )}
    </div>
  );
}

export default App;
