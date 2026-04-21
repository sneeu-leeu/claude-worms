export class Terrain {
  private scene: Phaser.Scene;
  private terrainTiles: Set<Phaser.GameObjects.Image> = new Set();
  private groundBodies: Phaser.Physics.Arcade.StaticGroup;
  private width: number;
  private height: number;
  private tileSize = 32;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.groundBodies = scene.physics.add.staticGroup();
    this.generateTerrain();
  }

  private generateTerrain(): void {
    const heightmap = this.generateHeightmap();
    const startY = this.height - 150;

    for (let x = 0; x < this.width; x += this.tileSize) {
      const terrainHeight = heightmap[Math.floor(x / this.tileSize)] || 0;
      const y = startY + terrainHeight;

      // Create terrain tiles from this point down
      for (let ty = y; ty < this.height; ty += this.tileSize) {
        const tile = this.scene.add.image(x, ty, 'terrain-tile');
        tile.setOrigin(0, 0);
        tile.setDepth(0);

        const body = this.scene.physics.add.staticImage(x, ty, 'terrain-tile');
        body.setOrigin(0, 0);
        this.groundBodies.add(body);
        this.terrainTiles.add(tile);
      }
    }
  }

  private generateHeightmap(): number[] {
    const cols = Math.ceil(this.width / this.tileSize);
    const heights: number[] = [];

    for (let i = 0; i < cols; i++) {
      const baseHeight = -20 - Math.sin(i * 0.2) * 30;
      const variation = Math.random() * 20 - 10;
      heights.push(baseHeight + variation);
    }

    return heights;
  }

  destroyAt(x: number, y: number, radius: number): void {
    const tilesToRemove: Phaser.GameObjects.Image[] = [];

    for (const tile of this.terrainTiles) {
      const dist = Phaser.Math.Distance.Between(x, y, tile.x, tile.y);
      if (dist < radius) {
        tilesToRemove.push(tile);
      }
    }

    tilesToRemove.forEach((tile) => {
      this.terrainTiles.delete(tile);
      tile.destroy();

      // Remove corresponding physics body
      const bodies = this.groundBodies.children.entries as Phaser.Physics.Arcade.StaticImage[];
      bodies.forEach((body) => {
        if (Math.abs(body.x - tile.x) < 2 && Math.abs(body.y - tile.y) < 2) {
          this.groundBodies.remove(body);
          body.destroy();
        }
      });
    });
  }

  getGroundBodies(): Phaser.Physics.Arcade.StaticGroup {
    return this.groundBodies;
  }

  getTerrainTiles(): Set<Phaser.GameObjects.Image> {
    return this.terrainTiles;
  }
}
