export class Explosion {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private radius: number;

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 100) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  explode(): void {
    // Create explosion circle
    const graphics = this.scene.make.graphics({ x: this.x, y: this.y, add: false });
    graphics.fillStyle(0xff6600, 0.8);
    graphics.fillCircle(0, 0, this.radius);
    graphics.setDepth(50);

    this.scene.add.existing(graphics);

    // Fade and shrink explosion
    this.scene.tweens.add({
      targets: graphics,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => {
        graphics.destroy();
      },
    });

    // Create debris particles
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 200 + Math.random() * 100;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const debris = this.scene.add.circle(this.x, this.y, 4, 0x8b7355);
      debris.setDepth(40);

      this.scene.physics.add.existing(debris);
      const body = debris.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(vx, vy);
      body.setDrag(0.99);
      body.setGravityY(300);

      this.scene.tweens.add({
        targets: debris,
        alpha: 0,
        duration: 800,
        ease: 'Quad.easeIn',
        onComplete: () => {
          debris.destroy();
        },
      });
    }

    // Play sound (placeholder - no audio loaded yet)
    // this.scene.sound.play('explosion');
  }

  getRadius(): number {
    return this.radius;
  }

  getCenter(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
