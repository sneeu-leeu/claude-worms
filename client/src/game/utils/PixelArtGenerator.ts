// Generate simple pixel art as canvas textures

export class PixelArtGenerator {
  static generateWormSprite(scene: Phaser.Scene, color: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    // Convert color number to RGB
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    // Draw simple worm shape (2x3 pixel segments)
    ctx.fillRect(2, 6, 3, 3); // Head
    ctx.fillRect(5, 5, 3, 5); // Body segment 1
    ctx.fillRect(8, 6, 3, 3); // Body segment 2
    ctx.fillRect(11, 7, 3, 2); // Tail

    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(3, 7, 1, 1);
    ctx.fillRect(4, 7, 1, 1);

    const texture = scene.textures.createCanvas('worm-pixel', canvas.width, canvas.height);
    texture.getSourceImage().getContext('2d')?.drawImage(canvas, 0, 0);

    return 'worm-pixel';
  }

  static generateTerrainTile(
    scene: Phaser.Scene,
    biome: 'grass' | 'sand' | 'lava' | 'ice' | 'space',
  ): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Base color based on biome
    const colors = {
      grass: { base: '#6b8e23', accent: '#556b2f', light: '#9acd32' },
      sand: { base: '#daa520', accent: '#cd853f', light: '#f0e68c' },
      lava: { base: '#dc143c', accent: '#ff4500', light: '#ffa500' },
      ice: { base: '#b0e0e6', accent: '#87ceeb', light: '#e0ffff' },
      space: { base: '#1a1a2e', accent: '#16213e', light: '#0f3460' },
    };

    const palette = colors[biome];

    // Draw base tile
    ctx.fillStyle = palette.base;
    ctx.fillRect(0, 0, 32, 32);

    // Add texture variation
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 32;
      const y = Math.random() * 32;
      ctx.fillStyle = Math.random() > 0.5 ? palette.accent : palette.light;
      ctx.fillRect(x, y, 2, 2);
    }

    // Add shading
    ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
    ctx.fillRect(0, 24, 32, 8);

    const key = `terrain-${biome}`;
    const texture = scene.textures.createCanvas(key, canvas.width, canvas.height);
    texture.getSourceImage().getContext('2d')?.drawImage(canvas, 0, 0);

    return key;
  }

  static generateExplosionParticle(scene: Phaser.Scene): string {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;

    // Random colors between yellow, orange, red
    const colors = ['#ffff00', '#ff8800', '#ff0000', '#ff6600'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, 0, 8, 8);

    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(1, 1, 3, 3);

    const texture = scene.textures.createCanvas('particle-explosion', canvas.width, canvas.height);
    texture.getSourceImage().getContext('2d')?.drawImage(canvas, 0, 0);

    return 'particle-explosion';
  }

  static generateHealthBarBackground(scene: Phaser.Scene): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 4;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, 32, 4);

    const texture = scene.textures.createCanvas('health-bg', canvas.width, canvas.height);
    texture.getSourceImage().getContext('2d')?.drawImage(canvas, 0, 0);

    return 'health-bg';
  }

  static generateHealthBar(scene: Phaser.Scene, health: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 4;
    const ctx = canvas.getContext('2d')!;

    // Color based on health
    let color = '#00ff00'; // Green
    if (health < 50) color = '#ffff00'; // Yellow
    if (health < 25) color = '#ff0000'; // Red

    const width = (health / 100) * 32;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, 4);

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, width, 2);

    const key = `health-bar-${health}`;
    const texture = scene.textures.createCanvas(key, canvas.width, canvas.height);
    texture.getSourceImage().getContext('2d')?.drawImage(canvas, 0, 0);

    return key;
  }
}
