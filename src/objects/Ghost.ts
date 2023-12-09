import Phaser from 'phaser';
import Enemy from './Enemy.ts';

export default class Ghost extends Enemy {
  startingHp: number = 200;

  speed: number = 1 / 10000;

  constructor(scene: Phaser.Scene, texture = 'ghost') {
    super(scene, texture);
  }
}
