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
        className="bg-gray-900 border-2 border-yellow-400 rounded shadow-lg p-2 min-w-max"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs text-yellow-300 font-bold mb-2">WEAPON SELECT</div>

        {selectedWeapon ? (
          <div>
            <div className="text-xl mb-2 text-center">{selectedWeapon.emoji}</div>
            <div className="text-xs text-white mb-2">{selectedWeapon.name}</div>
            <p className="text-xs text-gray-400 mb-3">{selectedWeapon.flavor}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleKill(selectedWeapon)}
                className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
              >
                Fire
              </button>
              <button
                onClick={() => setSelectedWeapon(null)}
                className="bg-gray-600 text-white px-2 py-1 text-xs rounded hover:bg-gray-700"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {weapons.map((weapon) => (
              <button
                key={weapon.name}
                onClick={() => setSelectedWeapon(weapon)}
                className="w-full text-left text-xs text-white hover:bg-gray-700 px-2 py-1 rounded transition"
              >
                {weapon.emoji} {weapon.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
