/* eslint-disable max-classes-per-file */
import Tower from './Tower.ts';
import type LevelScene from '../scenes/LevelScene.ts';
import { BulletClasses } from './BulletRanks.ts';

export class PotatoGun extends Tower {
  constructor(levelscene: LevelScene) {
    super({
      name: 'PotatoGun',
      scene: levelscene,
      towerScale: 0.7,
      y: 64 * 4 + 32,
      range: 200,
      bulletClass: BulletClasses.POTATO,
    });
    levelscene.add.existing(this);
    this.scene.towerManager.towerSourceGroup.add(this);

    this.on('refresh_PotatoGun', () => new PotatoGun(levelscene));
  }
}

export class Shotgun extends Tower {
  constructor(levelscene: LevelScene) {
    super({
      name: 'Shotgun',
      scene: levelscene,
      towerScale: 0.8,
      x: 64 + 32,
      y: 64 * 4 + 32,
      turrretTexture: 'singleBarrelTurret',
      bulletClass: BulletClasses.PEA,
    });
    levelscene.add.existing(this);
    this.scene.towerManager.towerSourceGroup.add(this);

    this.on('refresh_Shotgun', () => new Shotgun(levelscene));
  }
}

export class Popgun extends Tower {
  constructor(levelscene: LevelScene) {
    super({
      name: 'Popgun',
      scene: levelscene,
      towerScale: 0.9,
      y: 64 * 5 + 32,
      baseTexture: 'mediumBase',
      bulletClass: BulletClasses.POTATO,
    });
    levelscene.add.existing(this);
    this.scene.towerManager.towerSourceGroup.add(this);

    this.on('refresh_Popgun', () => new Popgun(levelscene));
  }
}
