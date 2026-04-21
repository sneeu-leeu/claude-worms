export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create(): void {
    // Start as a parallel scene (not stopping MainScene)
    this.scene.launch('MainScene');
  }

  update(): void {
    // UI updates will happen here in Phase 4
  }
}
