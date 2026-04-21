export class WeatherSystem {
  private scene: Phaser.Scene;
  private currentState: 'clear' | 'cloudy' | 'storm' = 'clear';
  private rainEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private lightningInterval: NodeJS.Timeout | null = null;

  constructor(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera) {
    this.scene = scene;
    this.camera = camera;
  }

  setState(newState: 'clear' | 'cloudy' | 'storm'): void {
    if (newState === this.currentState) return;

    this.currentState = newState;

    switch (newState) {
      case 'clear':
        this.showClear();
        break;
      case 'cloudy':
        this.showCloudy();
        break;
      case 'storm':
        this.showStorm();
        break;
    }
  }

  private showClear(): void {
    // Clear sky - remove effects
    if (this.rainEmitter) {
      this.rainEmitter.stop();
    }

    if (this.lightningInterval) {
      clearInterval(this.lightningInterval);
      this.lightningInterval = null;
    }

    // Reset camera tint
    this.camera.setTint(0xffffff);
  }

  private showCloudy(): void {
    // Cloudy - dim lighting slightly
    this.camera.setTint(0xccccdd);

    if (this.rainEmitter) {
      this.rainEmitter.stop();
    }

    if (this.lightningInterval) {
      clearInterval(this.lightningInterval);
      this.lightningInterval = null;
    }
  }

  private showStorm(): void {
    // Storm - rain particles + lightning
    this.camera.setTint(0x334455);

    // Create rain if not exists
    if (!this.rainEmitter) {
      const particles = this.scene.make.particles(
        {
          speed: { min: -100, max: 100 },
          angle: { min: 200, max: 340 },
          scale: { start: 0.3, end: 0.1 },
          lifespan: 1000,
          gravityY: 300,
          emitZone: {
            type: 'random',
            source: new Phaser.Geom.Rectangle(0, -50, this.scene.scale.width, 100),
          },
        },
        false,
      );

      // Create rain droplets
      particles.createEmitter({
        quantity: 10,
        frequency: 50,
      });

      this.rainEmitter = particles.emitters.entries[0];
    } else {
      this.rainEmitter.resume();
    }

    // Lightning strikes
    if (!this.lightningInterval) {
      this.lightningInterval = setInterval(() => {
        if (Math.random() < 0.3) {
          this.camera.flash(100, 255, 255, 255);
        }
      }, 800);
    }
  }

  update(): void {
    // Continuous update if needed
  }

  destroy(): void {
    if (this.rainEmitter) {
      this.rainEmitter.stop();
    }

    if (this.lightningInterval) {
      clearInterval(this.lightningInterval);
      this.lightningInterval = null;
    }
  }
}
