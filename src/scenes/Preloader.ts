import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('bullet', '/assets/bullet.png');
    this.load.image('ghost', '/assets/ghost64.png');
    this.load.image('enemy', '/assets/enemy64.png');
    this.load.image('tower', '/assets/tower64.png');
    this.load.image('scorpion', '/assets/scorpion.png');
    this.load.image('eye', '/assets/eye.png');
  }

  create(): void {
    this.scene.start('level001');
  }
}
