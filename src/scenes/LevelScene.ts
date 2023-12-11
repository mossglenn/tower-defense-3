import Phaser from 'phaser';
import {
  EnemyGroups,
  PathsData,
  SpawningTimelineData,
} from '../objects/CustomTypes.ts';
import PathManager from '../objects/PathManager.ts';
import SpawnManager from '../objects/SpawnManager.ts';

export default class LevelScene extends Phaser.Scene {
  pathsData!: PathsData;

  spawningTimelineData!: SpawningTimelineData;

  towerMap!: number[][];

  pathManager = new PathManager();

  spawnManager = new SpawnManager();

  graphics?: Phaser.GameObjects.Graphics;

  enemies: EnemyGroups = {};

  updatedtime?: Phaser.GameObjects.Text;

  debugSettings = {
    draw: {
      grid: true,
      paths: true,
    },
  };

  constructor(sceneKey: string = 'levelscene') {
    super(sceneKey);
  }

  create() {
    this.updatedtime = this.add.text(64, 125, 'updated time');
    this.graphics = this.add.graphics();

    this.pathManager.addData(this.pathsData);
    this.addGraphics(this.graphics);

    Object.keys(this.enemies).forEach((enemy) =>
      this.add.existing(this.enemies[enemy])
    );

    this.spawnManager.createTimeline(this, this.spawningTimelineData);
    if (this.spawnManager.spawningTimeline !== undefined) {
      this.spawnManager.spawningTimeline.play();
    }
  }

  update(time: number, _delta: number): void {
    if (this.updatedtime) {
      this.updatedtime.setText(Math.floor(time).toString());
    }
    const enemykeys = Object.keys(this.enemies);
    enemykeys.forEach((enemy) => console.log(this.enemies[enemy].children));
    console.log(
      `completed events = ${this.spawnManager.spawningTimeline?.totalComplete}`
    );

    if (this.spawnManager.spawningTimeline?.complete) {
      const numberActive = Object.keys(this.enemies).map((enemy) =>
        this.enemies[enemy].countActive()
      );
      const totalActive = numberActive.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      if (totalActive === 0) {
        this.scene.pause();
      }
    }
  }

  addGraphics(graphics: Phaser.GameObjects.Graphics) {
    if (this.debugSettings.draw.grid === true) {
      LevelScene.drawGrid(graphics);
    }
    if (this.debugSettings.draw.paths === true) {
      this.pathManager.pathNames.forEach((pathName) => {
        this.pathManager!.paths![pathName].draw(graphics);
      });
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
}
