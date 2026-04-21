import React, { useState } from 'react';
import { useWormStore } from '../store/useWormStore';

interface Weapon {
  name: string;
  emoji: string;
  signal: 'SIGTERM' | 'SIGKILL' | 'SIGHUP';
  flavor: string;
}

const weapons: Weapon[] = [
  { name: 'Bazooka', emoji: '💥', signal: 'SIGTERM', flavor: 'Polite shutdown' },
  { name: 'Grenade', emoji: '💣', signal: 'SIGHUP', flavor: 'Hangup signal' },
  { name: 'Dynamite', emoji: '🧨', signal: 'SIGKILL', flavor: 'Instant death' },
];

interface WeaponMenuProps {
  pid: number;
  x: number;
  y: number;
  onClose: () => void;
}

export function WeaponMenu({ pid, x, y, onClose }: WeaponMenuProps) {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

  const handleKill = async (weapon: Weapon) => {
    try {
      await fetch(`/api/instances/${pid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal: weapon.signal, weapon: weapon.name }),
      });
      onClose();
    } catch (err) {
      console.error('Error killing worm:', err);
    }
  };

  return (
    <div
      className="fixed z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border-4 border-yellow-400 shadow-lg p-3 min-w-max pixel-border-thick pixel-scanlines"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs retro-yellow font-bold mb-3 pixel-text">= WEAPON SELECT =</div>

        {selectedWeapon ? (
          <div>
            <div className="text-3xl mb-3 text-center">{selectedWeapon.emoji}</div>
            <div className="text-xs retro-green mb-2 pixel-text">{selectedWeapon.name.toUpperCase()}</div>
            <p className="text-xs text-gray-400 mb-4 pixel-small">{selectedWeapon.flavor}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleKill(selectedWeapon)}
                className="pixel-button bg-red-600 text-white px-3 py-1 text-xs flex-1"
              >
                FIRE!
              </button>
              <button
                onClick={() => setSelectedWeapon(null)}
                className="pixel-button bg-gray-600 text-white px-3 py-1 text-xs flex-1"
              >
                BACK
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {weapons.map((weapon) => (
              <button
                key={weapon.name}
                onClick={() => setSelectedWeapon(weapon)}
                className="w-full text-left text-xs retro-cyan hover:retro-yellow px-2 py-1 transition pixel-text border border-current hover:border-yellow-400"
              >
                {weapon.emoji} {weapon.name.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
