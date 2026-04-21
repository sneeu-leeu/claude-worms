import React, { useEffect } from 'react';
import { initializeSocket } from './socket/SocketClient';
import { useSocketEvents } from './socket/useSocketEvents';
import { useWormStore } from './store/useWormStore';
import { SystemStatus } from './components/SystemStatus';
import { WormList } from './components/WormList';
import { GameContainer } from './components/GameContainer';
import { SpectatePanel } from './components/SpectatePanel';

function App() {
  useSocketEvents();

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
    </div>
  );
}

export default App;
