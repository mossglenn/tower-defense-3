/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import Enemy from './Enemy.ts';

export class Ghost extends Enemy {
  startingHp: number = 200;

  speed: number = 10;

  constructor(scene: Phaser.Scene, texture = 'ghost') {
    super(scene, texture);
  }
}

export class Scorpion extends Enemy {
  startingHp: number = 200;

  speed: number = 10;

  constructor(scene: Phaser.Scene, texture = 'scorpion') {
    super(scene, texture);
  }
}

export class Eye extends Enemy {
  startingHp: number = 200;

  speed: number = 15;

  constructor(scene: Phaser.Scene, texture = 'eye') {
    super(scene, texture);
  }
}
