import type { WormInstance } from '../../types';

export class Worm extends Phaser.Physics.Arcade.Sprite {
  private worm: WormInstance;
  private chatBubble: Phaser.GameObjects.Text | null = null;
  private healthBar: Phaser.GameObjects.Graphics | null = null;
  private isMoving = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    worm: WormInstance,
  ) {
    super(scene, x, y, 'worm-sprite');
    this.worm = worm;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Setup physics
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDrag(0.5);
    this.setFrictionAir(0.02);

    // Color based on worm name
    this.setTint(this.getColorFromName(worm.sessionId));

    // Create chat bubble
    this.createChatBubble();
    this.createHealthBar();

    // Setup animations
    this.setupAnimations();
    this.updateAnimationState();
  }

  private getColorFromName(sessionId: string): number {
    const hash = sessionId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da];
    return colors[hash % colors.length];
  }

  private createChatBubble(): void {
    this.chatBubble = this.scene.add.text(this.x, this.y - 40, this.worm.currentTask, {
      fontSize: '11px',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 4, y: 2 },
      align: 'center',
      wordWrap: { width: 100 },
    });
    this.chatBubble.setOrigin(0.5);
    this.chatBubble.setDepth(100);
  }

  private createHealthBar(): void {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  private updateHealthBar(): void {
    if (!this.healthBar) return;

    this.healthBar.clear();

    // Background
    this.healthBar.fillStyle(0xcccccc, 1);
    this.healthBar.fillRect(this.x - 16, this.y - 25, 32, 4);

    // Health
    const healthWidth = (this.worm.health / 100) * 32;
    const healthColor = this.worm.health > 50 ? 0x00ff00 : this.worm.health > 25 ? 0xffff00 : 0xff0000;
    this.healthBar.fillStyle(healthColor, 1);
    this.healthBar.fillRect(this.x - 16, this.y - 25, healthWidth, 4);
  }

  private setupAnimations(): void {
    // Animations will be created in PreloadScene
    // For now, worms just use their static sprite
  }

  private updateAnimationState(): void {
    const secondsIdle = (Date.now() - this.worm.lastActivity) / 1000;

    // Visual feedback: slight scale change based on activity
    if (secondsIdle < 5) {
      if (!this.isMoving) {
        this.isMoving = true;
        this.setScale(1.1);
      }
    } else {
      if (this.isMoving) {
        this.isMoving = false;
        this.setScale(0.9);
      }
    }
  }

  update(newWorm: WormInstance): void {
    this.worm = newWorm;

    // Update chat bubble
    if (this.chatBubble) {
      this.chatBubble.setText(newWorm.currentTask);
      this.chatBubble.setX(this.x);
      this.chatBubble.setY(this.y - 40);
    }

    // Update health bar
    this.updateHealthBar();

    // Update animation state
    this.updateAnimationState();
  }

  getWormData(): WormInstance {
    return this.worm;
  }

  preUpdate(): void {
    super.preUpdate(0, 0);

    // Keep chat bubble and health bar synced
    if (this.chatBubble) {
      this.chatBubble.setX(this.x);
      this.chatBubble.setY(this.y - 40);
    }

    if (this.healthBar) {
      this.updateHealthBar();
    }
  }
}
