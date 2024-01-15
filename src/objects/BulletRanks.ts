/* eslint-disable max-classes-per-file */
import Bullet from './Bullet.ts';
import type LevelScene from '../scenes/LevelScene.ts';
import type { BulletConfig } from './CustomTypes';

export class Potato extends Bullet {
  constructor(levelscene: LevelScene, x: number, y: number) {
    const bulletConfig: BulletConfig = {
      scene: levelscene,
      speed: 500,
      texture: 'bullet_potato',
      x,
      y,
    };
    super(bulletConfig);
    this.levelscene.add.existing(this);
  }
}

export class Pea extends Bullet {
  constructor(levelscene: LevelScene, x: number, y: number) {
    const bulletConfig: BulletConfig = {
      scene: levelscene,
      texture: 'bullet_pea',
      x,
      y,
    };
    super(bulletConfig);
    this.levelscene.add.existing(this);
  }
}
export const BulletClasses = {
  POTATO: Potato,
  PEA: Pea,
  // PEAS: 'peas',
  // CARROT: 'carrot',
  // TUNA: 'tuna',
  // POPCORN: 'popcorn',
} as const;

export type BulletTypes = (typeof BulletClasses)[keyof typeof BulletClasses];
