import { PixelArtGenerator } from '../utils/PixelArtGenerator';
import { BiomeManager } from '../utils/BiomeManager';

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

    const progressText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontSize: '16px',
      color: '#ffffff',
    });
    progressText.setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
      progressText.setText(`Loading: ${Math.round(value * 100)}%`);
    });

    this.load.setPath('assets');
  }

  create(): void {
    // Generate all pixel art assets
    this.generateAssets();
    this.scene.start('MainScene');
  }

  private generateAssets(): void {
    // Generate terrain biomes
    const biomes: Array<'grass' | 'sand' | 'lava' | 'ice' | 'space'> = [
      'grass',
      'sand',
      'lava',
      'ice',
      'space',
    ];
    biomes.forEach((biome) => {
      PixelArtGenerator.generateTerrainTile(this, biome);
    });

    // Generate worm sprites with different colors
    const wormColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da];
    wormColors.forEach((color) => {
      const key = `worm-${color.toString(16)}`;
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;

      const r = (color >> 16) & 255;
      const g = (color >> 8) & 255;
      const b = color & 255;

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(2, 6, 3, 3);
      ctx.fillRect(5, 5, 3, 5);
      ctx.fillRect(8, 6, 3, 3);
      ctx.fillRect(11, 7, 3, 2);

      ctx.fillStyle = 'white';
      ctx.fillRect(3, 7, 1, 1);
      ctx.fillRect(4, 7, 1, 1);

      const texture = this.textures.createCanvas(key, canvas.width, canvas.height);
      texture.getSourceImage().getContext('2d')?.drawImage(canvas, 0, 0);
    });

    // Fallback sprite
    this.textures.generateKey('worm-sprite', 16, 16, 0x00ff00);

    // Generate explosion
    PixelArtGenerator.generateExplosionParticle(this);

    // Generate UI elements
    PixelArtGenerator.generateHealthBarBackground(this);
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
