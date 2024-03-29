import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('play', '/assets/sprites/play.png');

    this.load.image('bullet', '/assets/sprites/bullet.png');
    this.load.image('ghost', '/assets/sprites/ghost64.png');
    this.load.image('enemy', '/assets/sprites/enemy64.png');
    this.load.image('tower', '/assets/sprites/tower64.png');
    this.load.image('scorpion', '/assets/sprites/scorpion.png');
    this.load.image('eye', '/assets/sprites/eye.png');

    this.load.image('trashbin', '/assets/sprites/trash-bin.png');
    this.load.image('correct', '/assets/sprites/correct.png');

    this.load.image('smallTurret', '/assets/sprites/tower_turret_small.png');
    this.load.image(
      'singleBarrelTurret',
      '/assets/sprites/tower_turret_singleBarrel.png'
    );

    this.load.image('smallBase', '/assets/sprites/tower_base_small.png');
    this.load.image('mediumBase', '/assets/sprites/tower_base_medium.png');

    this.load.image('bullet_potato', '/assets/sprites/bullet_potato.png');
    this.load.image('bullet_pea', '/assets/sprites/bullet_pea.png');

    this.load.image('collider131', '/assets/sprites/collider131.png');
    this.load.image('collider132', '/assets/sprites/collider132.png');
  }

  create(): void {
    this.scene.start('level001');
  }
}
