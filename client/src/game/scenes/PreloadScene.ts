export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // Show loading bar
    const { width, height } = this.cameras.main;
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
    });

    // For now, we'll use placeholder assets
    // In Phase 5, replace these with actual spritesheets
    this.load.setPath('assets');

    // Placeholder: create simple graphics instead of loading images
    this.textures.generateKey('worm-sprite', 8, 8, 0x00ff00);
    this.textures.generateKey('terrain-tile', 32, 32, 0x8b7355);
    this.textures.generateKey('explosion', 16, 16, 0xff6600);
  }

  create(): void {
    this.scene.start('MainScene');
  }
}

// Helper to generate placeholder textures
declare global {
  namespace Phaser.Textures {
    interface TextureManager {
      generateKey(key: string, width: number, height: number, color: number): void;
    }
  }
}

Phaser.Textures.TextureManager.prototype.generateKey = function (
  key: string,
  width: number,
  height: number,
  color: number,
) {
  const graphics = new Phaser.Graphics(this.scene as any);
  graphics.fillStyle(color);
  graphics.fillRect(0, 0, width, height);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
};
