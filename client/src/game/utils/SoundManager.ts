// Simple sound effect manager with placeholder audio generation

export class SoundManager {
  static playExplosion(scene: Phaser.Scene): void {
    // Placeholder: Just log for now
    // In production, would use scene.sound.play('explosion')
    console.log('[SFX] Explosion!');
  }

  static playSpawn(scene: Phaser.Scene): void {
    console.log('[SFX] Worm spawn');
  }

  static playDeath(scene: Phaser.Scene): void {
    console.log('[SFX] Worm death');
  }

  static playWeaponSelect(scene: Phaser.Scene): void {
    console.log('[SFX] Weapon select');
  }

  static playHit(scene: Phaser.Scene): void {
    console.log('[SFX] Hit!');
  }

  static playAmbient(scene: Phaser.Scene, biome: string): void {
    console.log(`[SFX] Ambient: ${biome}`);
  }

  // Utility: Generate simple sine wave audio (for future use)
  static generateTone(frequency: number, duration: number): AudioBuffer | null {
    // This would require AudioContext setup
    // For now, just placeholder
    return null;
  }
}
