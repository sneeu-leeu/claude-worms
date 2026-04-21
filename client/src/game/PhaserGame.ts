import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { MainScene } from './scenes/MainScene';
import { UIScene } from './scenes/UIScene';

let game: Phaser.Game | null = null;

export function initializePhaserGame(container: HTMLElement): Phaser.Game {
  if (game) return game;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container,
    width: Math.max(800, container.clientWidth),
    height: Math.max(600, container.clientHeight),
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    scene: [PreloadScene, MainScene, UIScene],
    backgroundColor: '#87CEEB',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  game = new Phaser.Game(config);
  return game;
}

export function getPhaserGame(): Phaser.Game {
  if (!game) {
    throw new Error('Phaser game not initialized');
  }
  return game;
}

export function destroyPhaserGame(): void {
  if (game) {
    game.destroy(true);
    game = null;
  }
}
