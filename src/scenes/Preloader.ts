import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('bullet', '/assets/sprites/bullet.png');
    this.load.image('ghost', '/assets/sprites/ghost64.png');
    this.load.image('enemy', '/assets/sprites/enemy64.png');
    this.load.image('tower', '/assets/sprites/tower64.png');
    this.load.image('scorpion', '/assets/sprites/scorpion.png');
    this.load.image('eye', '/assets/sprites/eye.png');
  }

  create(): void {
    this.scene.start('level001');
  }
}
