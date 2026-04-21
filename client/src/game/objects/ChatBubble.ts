export class ChatBubble extends Phaser.GameObjects.Container {
  private textObject: Phaser.GameObjects.Text;
  private backgroundBox: Phaser.GameObjects.Graphics;
  private maxWidth = 120;
  private maxHeight = 60;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);

    scene.add.existing(this);
    this.setDepth(100);

    // Background box
    this.backgroundBox = scene.make.graphics({ add: false });
    this.add(this.backgroundBox);

    // Text
    this.textObject = scene.make.text(
      {
        x: 0,
        y: 0,
        text: text,
        style: {
          fontSize: '10px',
          color: '#000000',
          wordWrap: { width: this.maxWidth - 8 },
          align: 'center',
        },
      },
      false,
    );
    this.add(this.textObject);

    this.updateBackground();
  }

  setText(text: string): void {
    this.textObject.setText(text);
    this.updateBackground();
  }

  private updateBackground(): void {
    this.backgroundBox.clear();

    const width = Math.min(this.maxWidth, Math.max(80, this.textObject.width + 8));
    const height = Math.min(this.maxHeight, this.textObject.height + 6);

    // White background with border
    this.backgroundBox.fillStyle(0xffffff, 1);
    this.backgroundBox.fillRoundedRect(-width / 2, -height / 2, width, height, 4);

    this.backgroundBox.lineStyle(1, 0x333333, 1);
    this.backgroundBox.strokeRoundedRect(-width / 2, -height / 2, width, height, 4);

    // Point downward
    this.backgroundBox.fillTriangleShape(
      new Phaser.Geom.Triangle(-6, height / 2, 6, height / 2, 0, height / 2 + 8),
    );
  }

  setPosition(x: number, y: number): this {
    return super.setPosition(x, y);
  }
}
