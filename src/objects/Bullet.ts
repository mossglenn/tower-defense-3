import Phaser from 'phaser';
import type { BulletConfig } from './CustomTypes.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  name: string;

  levelscene: LevelScene;

  mass: number;

  damage: number;

  speed: number;

  spin: number;

  constructor(bulletConfig: BulletConfig) {
    const defaults = {
      name: 'bullet',
      texture: 'bullet',
      width: 16,
      x: 32,
      y: 32,
      mass: 0,
      damage: 50,
      speed: 1000,
      spin: 1,
    };
    const config = { ...defaults, ...bulletConfig };
    super(config.scene, config.x, config.y, config.texture);
    this.name = config.name;
    this.levelscene = config.scene;
    this.mass = config.mass;
    this.damage = config.damage;
    this.speed = config.speed;
    this.spin = config.spin;
  }
}
