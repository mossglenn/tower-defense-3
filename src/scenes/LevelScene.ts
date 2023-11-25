import Phaser from 'phaser';
import EnemyGroup from '../objects/EnemyGroup.ts';

export default class LevelScene extends Phaser.Scene {
  debugSettings = {
    draw: {
      grid: true,
      path: true,
    },
  };

  pathPoints: { x: number; y: number }[] = [];

  path: Phaser.Curves.Path;

  enemies: EnemyGroup = {};

  // map[row][col]
  towerMap: number[][] = [];

  constructor(key: string) {
    super(key);
    this.path = this.createPath();
  }

  create() {
    this.addGraphics();
  }

  addGraphics() {
    const graphics = this.add.graphics();
    if (this.debugSettings.draw.grid === true) {
      LevelScene.drawGrid(graphics);
    }
    if (this.debugSettings.draw.path === true) {
      this.path.draw(graphics);
    }
  }

  static drawGrid(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.2);
    for (let i = 0; i < 9; i += 1) {
      graphics.moveTo(0, i * 64);
      graphics.lineTo(768, i * 64);
    }
    for (let j = 0; j < 12; j += 1) {
      graphics.moveTo(j * 64, 0);
      graphics.lineTo(j * 64, 576);
    }
    graphics.strokePath();
  }

  createPath(): Phaser.Curves.Path {
    const pathStart = this.pathPoints.shift();
    if (pathStart !== undefined) {
      const startingX = pathStart.x === 0 ? -32 : pathStart!.x;
      const startingY = pathStart.y === 0 ? -32 : pathStart!.y;
      const newPath = new Phaser.Curves.Path(startingX, startingY);
      this.pathPoints.forEach((value) => {
        newPath.lineTo(value.x, value.y);
      });
      console.log('Returning new path');
      return newPath;
    }
    console.log('Error creating new path');
    return new Phaser.Curves.Path();
  }
}
