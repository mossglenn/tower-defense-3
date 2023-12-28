/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import Tower from './Tower.ts';

export class PotatoGun extends Tower {
  constructor(levelscene: Phaser.Scene) {
    super({ scene: levelscene, towerScale: 0.7 });
    levelscene.add.existing(this);
  }
}

export class Shotgun extends Tower {
  constructor(levelscene: Phaser.Scene) {
    super({
      scene: levelscene,
      towerScale: 0.8,
      x: 64 + 32,
      turrretTexture: 'singleBarrelTurret',
    });
    levelscene.add.existing(this);
  }
}

export class Popgun extends Tower {
  constructor(levelscene: Phaser.Scene) {
    super({
      scene: levelscene,
      towerScale: 0.9,
      y: 64 + 32,
      baseTexture: 'mediumBase',
    });
    levelscene.add.existing(this);
  }
}
