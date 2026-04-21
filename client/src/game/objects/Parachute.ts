export class Parachute {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private parachuteShape: Phaser.GameObjects.Graphics;
  private rope: Phaser.GameObjects.Graphics;
  private onComplete: (() => void) | null = null;

  constructor(scene: Phaser.Scene, x: number, startY: number, onComplete: () => void) {
    this.scene = scene;
    this.onComplete = onComplete;

    // Create container
    this.container = scene.add.container(x, startY);
    this.container.setDepth(60);

    // Draw parachute canopy
    this.parachuteShape = scene.make.graphics({ add: false });
    this.parachuteShape.fillStyle(0xff0000, 1);
    this.parachuteShape.fillCircle(0, -20, 25);
    this.parachuteShape.lineStyle(1, 0xcc0000, 1);
    this.parachuteShape.strokeCircle(0, -20, 25);
    this.container.add(this.parachuteShape);

    // Draw ropes
    this.rope = scene.make.graphics({ add: false });
    this.rope.lineStyle(1, 0x888888, 1);
    this.rope.lineBetween(-15, 5, -10, 30);
    this.rope.lineBetween(-5, 5, -5, 30);
    this.rope.lineBetween(5, 5, 5, 30);
    this.rope.lineBetween(15, 5, 10, 30);
    this.container.add(this.rope);

    // Draw person hanging
    const person = scene.make.circle(
      {
        x: 0,
        y: 40,
        radius: 3,
        fillColor: 0x333333,
      },
      false,
    );
    this.container.add(person);

    this.animate();
  }

  private animate(): void {
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y + 150,
      duration: 800,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.container.destroy();
        this.onComplete?.();
      },
    });
  }
}
