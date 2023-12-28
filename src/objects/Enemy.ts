import Phaser from 'phaser';
import { Enemies } from './CustomTypes.ts';

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  startingHp: number = 100;

  speed: number = 1;

  key: string;

  hp: number;

  path?: Phaser.Curves.Path | undefined;

  pathCovered?: number;

  pathVector: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, texture: string = Enemies.ENEMY) {
    super(scene, -100, -100, texture);
    this.hp = this.startingHp;
    this.key = texture;
    this.pathVector = new Phaser.Math.Vector2();
  }

  update(_time: number, delta: number): void {
    // console.log(`updating`);
    if (this.path !== undefined) {
      this.pathCovered =
        this.pathCovered === undefined
          ? 0
          : this.pathCovered! + (this.speed / 100000) * delta;
      if (this.pathCovered >= 1) {
        this.setActive(false);
        this.setVisible(false);
      } else {
        this.path.getPoint(this.pathCovered, this.pathVector);
        this.setPosition(this.pathVector!.x, this.pathVector!.y);
      }
    }
  }

  setPath(newPath: Phaser.Curves.Path) {
    this.path = newPath;
    this.pathCovered = 0;
    this.path.getPoint(0, this.pathVector);
    this.setPosition(this.pathVector!.x, this.pathVector!.y);
  }

  // damage(points: number) {
  //   this.hp -= points;
  //   if (this.hp <= 0) {
  //     this.setActive(false);
  //     this.setVisible(false);
  //   }
  // }

  // heal(points: number) {
  //   this.hp += points;
  //   if (this.hp > this.startingHp) {
  //     this.hp = this.startingHp;
  //   }
  // }
}
