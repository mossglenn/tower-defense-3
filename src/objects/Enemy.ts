import Phaser from 'phaser';
import LevelScene from '../scenes/LevelScene.ts';

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  startingHp: number = 200;

  speed: number = 1 / 10000;

  timeBetweenSpawning: number = 2000;

  key: string;

  hp: number = 100;

  path: Phaser.Curves.Path;

  pathCovered: number;

  pathVector: Phaser.Math.Vector2;

  constructor(scene: LevelScene, texture: string = 'enemy') {
    super(
      scene,
      scene.path.getStartPoint().x,
      scene.path.getStartPoint().y,
      texture
    );
    this.path = scene.path;
    this.pathCovered = 0;
    this.pathVector = scene.path.getStartPoint();
    this.hp = this.startingHp;
    this.key = texture;
  }

  update(delta: number): void {
    this.pathCovered += this.speed * delta;
    if (this.pathCovered >= 1) {
      this.setActive(false);
      this.setVisible(false);
    }
    this.path.getPoint(this.pathCovered, this.pathVector);
    this.setPosition(this.pathVector.x, this.pathVector.y);
  }

  damage(points: number) {
    this.hp -= points;
    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  heal(points: number) {
    this.hp += points;
    if (this.hp > this.startingHp) {
      this.hp = this.startingHp;
    }
  }
}
