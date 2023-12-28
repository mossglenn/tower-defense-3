import Phaser from 'phaser';
import { Targeting, TowerConfig } from './CustomTypes.ts';

export default abstract class Tower extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;

  base: Phaser.GameObjects.Sprite;

  towerScale: number;

  turretTexture: string;

  bullet: string = 'bullet';

  // decorations: string[] = [];

  rateOfFire: number = 10;

  targeting: keyof typeof Targeting = 'FIRST';

  // depth: number = 50;

  constructor(towerConfig: TowerConfig) {
    const defaults = {
      turrretTexture: 'smallTurret',
      baseTexture: 'smallBase',
      x: 32,
      y: 32,
      towerScale: 1,
    };
    const config = { ...defaults, ...towerConfig };
    super(config.scene, config.x, config.y, config.turrretTexture);
    this.scene = config.scene;
    this.towerScale = config.towerScale;
    this.turretTexture = config.turrretTexture;
    this.base = config.scene.add
      .sprite(config.x, config.y, config.baseTexture)
      .setScale(config.towerScale);
    this.scene.physics.add
      .existing(this)
      .setCircle(
        (this.width / 2) * config.towerScale,
        (this.width - this.width * config.towerScale) / 2,
        (this.width - this.width * config.towerScale) / 2
      )
      .setDepth(99)
      .setInteractive({ draggable: true });
    this.scene.add.existing(this.base).setDepth(98);
    this.setScale(config.towerScale);
  }

  dragTower(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.base.x = x;
    this.base.y = y;
  }

  findTarget() {
    const method = this.targeting;
    console.log(`looking for ${method} enemy`);
  }
}
