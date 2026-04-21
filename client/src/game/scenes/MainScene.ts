import { Worm } from '../objects/Worm';
import { Terrain } from '../objects/Terrain';
import { Explosion } from '../objects/Explosion';
import { Parachute } from '../objects/Parachute';
import { WeatherSystem } from '../objects/WeatherSystem';
import { EventBridge } from '../EventBridge';
import { useWormStore } from '../../store/useWormStore';
import { useSystemStore } from '../../store/useSystemStore';
import type { WormInstance } from '../../types';

export class MainScene extends Phaser.Scene {
  private terrain: Terrain | null = null;
  private worms = new Map<number, Worm>();
  private camera: Phaser.Cameras.Scene2D.Camera | null = null;
  private weatherSystem: WeatherSystem | null = null;

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.camera = this.cameras.main;
    this.camera.setBounds(0, 0, this.scale.width, this.scale.height);

    // Initialize weather system
    this.weatherSystem = new WeatherSystem(this, this.camera);
    const systemStore = useSystemStore.getState();
    this.weatherSystem.setState(systemStore.weatherState);

    // Create terrain
    this.terrain = new Terrain(this, this.scale.width, this.scale.height);

    // Spawn existing worms
    const store = useWormStore.getState();
    const existingWorms = store.getAllWorms();
    existingWorms.forEach((worm) => {
      this.spawnWorm(worm);
    });

    // Listen for new worms from EventBridge
    EventBridge.on('worm:spawned', (worm) => {
      this.spawnWorm(worm);
    });

    // Listen for worm updates
    EventBridge.on('worm:update', (worm) => {
      this.updateWorm(worm);
    });

    // Listen for worm deaths
    EventBridge.on('worm:died', (data) => {
      this.killWorm(data.pid);
    });

    // Listen for weather changes
    EventBridge.on('system:weather', (data) => {
      this.weatherSystem?.setState(data.weatherState);
    });

    // Setup collisions
    this.setupCollisions();
  }

  private spawnWorm(worm: WormInstance): void {
    if (this.worms.has(worm.pid)) return;

    const x = Math.random() * (this.scale.width - 100) + 50;
    const landingY = this.scale.height - 200;

    const wormSprite = new Worm(this, x, landingY, worm);
    wormSprite.setAlpha(0);
    this.worms.set(worm.pid, wormSprite);

    // Play parachute drop animation
    new Parachute(this, x, -100, () => {
      // Parachute landing complete, fade in worm
      this.tweens.add({
        targets: wormSprite,
        alpha: 1,
        duration: 200,
        ease: 'Quad.easeIn',
      });
    });

    console.log('Worm spawned:', worm.sessionId);
  }

  private updateWorm(worm: WormInstance): void {
    const wormSprite = this.worms.get(worm.pid);
    if (wormSprite) {
      wormSprite.update(worm);
    }
  }

  private killWorm(pid: number): void {
    const wormSprite = this.worms.get(pid);
    if (!wormSprite) return;

    const x = wormSprite.x;
    const y = wormSprite.y;

    // Create explosion
    const explosion = new Explosion(this, x, y, 120);
    explosion.explode();

    // Destroy terrain around explosion
    if (this.terrain) {
      this.terrain.destroyAt(x, y, 120);
    }

    // Apply force to nearby worms
    for (const otherWorm of this.worms.values()) {
      if (otherWorm.getData('pid') !== pid) {
        const dist = Phaser.Math.Distance.Between(x, y, otherWorm.x, otherWorm.y);
        if (dist < 200) {
          const angle = Math.atan2(otherWorm.y - y, otherWorm.x - x);
          const force = 500 * (1 - dist / 200);
          const body = otherWorm.body as Phaser.Physics.Arcade.Body;
          body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force - 200);
        }
      }
    }

    // Play death animation
    this.tweens.add({
      targets: wormSprite,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => {
        wormSprite.destroy();
        this.worms.delete(pid);
      },
    });

    console.log('Worm killed:', pid);
  }

  private setupCollisions(): void {
    if (!this.terrain) return;

    for (const wormSprite of this.worms.values()) {
      this.physics.add.collider(wormSprite, this.terrain.getGroundBodies());
    }
  }

  update(): void {
    // Update any moving worms
    this.worms.forEach((wormSprite) => {
      wormSprite.preUpdate();
    });

    // Simple camera follow to selected worm
    const store = useWormStore.getState();
    if (store.selectedWormPid) {
      const selectedWorm = this.worms.get(store.selectedWormPid);
      if (selectedWorm && this.camera) {
        this.camera.smoothFollow(selectedWorm, 0.1);
      }
    }
  }

  getWorms(): Map<number, Worm> {
    return this.worms;
  }

  getTerrain(): Terrain | null {
    return this.terrain;
  }
}
