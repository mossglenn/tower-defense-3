/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import Tower from './Tower.ts';

export class PotatoGun extends Tower {
  constructor(levelscene: Phaser.Scene) {
    super({
      name: 'PotatoGun',
      scene: levelscene,
      towerScale: 0.7,
      y: 64 * 4 + 32,
      range: 200,
    });
    levelscene.add.existing(this);
    this.on('refresh_PotatoGun', () => new PotatoGun(levelscene));
  }
}

export class Shotgun extends Tower {
  constructor(levelscene: Phaser.Scene) {
    super({
      name: 'Shotgun',
      scene: levelscene,
      towerScale: 0.8,
      x: 64 + 32,
      y: 64 * 4 + 32,
      turrretTexture: 'singleBarrelTurret',
    });
    levelscene.add.existing(this);
    this.on('refresh_Shotgun', () => new Shotgun(levelscene));
  }
}

export class Popgun extends Tower {
  constructor(levelscene: Phaser.Scene) {
    super({
      name: 'Popgun',
      scene: levelscene,
      towerScale: 0.9,
      y: 64 * 5 + 32,
      baseTexture: 'mediumBase',
    });
    levelscene.add.existing(this);
    this.on('refresh_Popgun', () => new Popgun(levelscene));
  }
}
