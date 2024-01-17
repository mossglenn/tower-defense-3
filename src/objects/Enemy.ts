import Phaser from 'phaser';
import type LevelScene from '../scenes/LevelScene.ts';

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  levelscene: LevelScene;

  startingHp: number = 100;

  speed: number = 1;

  key: string;

  hp: number;

  path?: Phaser.Curves.Path | undefined;

  pathCovered?: number;

  pathVector: Phaser.Math.Vector2;

  distanceToTower: number = 1000000;

  constructor(scene: LevelScene, texture: string = 'enemy') {
    super(scene, -100, -100, texture);
    this.levelscene = scene;
    this.hp = this.startingHp;
    this.key = texture;
    this.pathVector = new Phaser.Math.Vector2();
  }

  update(_time: number, delta: number): void {
    if (this.body?.embedded) {
      this.setAngle(90);
    } else {
      this.setAngle(0);
    }
    if (this.path !== undefined) {
      this.pathCovered =
        this.pathCovered === undefined
          ? 0
          : this.pathCovered! + (this.speed / 100000) * delta;
      if (this.pathCovered >= 1) {
        this.setActive(false);
        this.setVisible(false);
        this.levelscene.visibleEnemies.remove(this);
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

  damage(points: number) {
    this.setDebugBodyColor(0xffff00);
    this.hp -= points;
    if (this.hp <= 0) {
      this.levelscene.visibleEnemies.remove(this);
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
