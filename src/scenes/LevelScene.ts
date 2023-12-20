import Phaser from 'phaser';
import {
  EnemyGroups,
  EnemyTypes,
  SpawningTimelineData,
} from '../objects/CustomTypes.ts';
import PathManager from '../objects/PathManager.ts';
import SpawnManager from '../objects/SpawnManager.ts';

export default class LevelScene extends Phaser.Scene {
  tileAssets!: {
    json: string;
    png: string;
    tilesetNames: string[];
  };

  spawningTimelineData!: SpawningTimelineData;

  map?: Phaser.Tilemaps.Tilemap;

  tileSets?: Phaser.Tilemaps.Tileset[];

  mapTerrain: Phaser.Tilemaps.TilemapLayer | null = null;

  mapObstacles: Phaser.Tilemaps.TilemapLayer | null = null;

  towerMap!: number[][];

  pathManager = new PathManager();

  spawnManager = new SpawnManager();

  graphics?: Phaser.GameObjects.Graphics;

  enemies: EnemyGroups = {};

  updatedtime?: Phaser.GameObjects.Text;

  debugSettings = {
    draw: {
      grid: false,
      paths: false,
    },
  };

  constructor(sceneKey: string = 'levelscene') {
    super(sceneKey);
  }

  preload() {
    this.load.image('tiles', this.tileAssets.png);
    this.load.tilemapTiledJSON('tilemap', this.tileAssets.json);
  }

  create() {
    this.updatedtime = this.add.text(64, 125, 'updated time');
    this.graphics = this.add.graphics();

    this.addGraphics(this.graphics);

    Object.keys(this.enemies).forEach((enemy) =>
      this.add.existing(this.enemies[enemy])
    );

    if (this.map !== undefined) {
      this.pathManager.addPathsFromMapLayers(
        this.map.objects
          .map((layer): Phaser.Tilemaps.ObjectLayer | null =>
            this.map!.getObjectLayer(layer.name)
          )
          .filter((l) => l != null) as Phaser.Tilemaps.ObjectLayer[] // nulls are removed so forcing type is safe
      );
    }
    const pathNameErrors = SpawnManager.checkDataNames(
      this.pathManager.pathNames,
      this.spawningTimelineData
    );
    if (pathNameErrors !== undefined) {
      pathNameErrors.forEach((error) => console.error(error));
    }

    this.spawnManager.createTimeline(this, this.spawningTimelineData);
    if (this.spawnManager.spawningTimeline !== undefined) {
      this.spawnManager.spawningTimeline.play();
    }
  }

  update(time: number, _delta: number): void {
    if (this.updatedtime) {
      this.updatedtime.setText(Math.floor(time).toString());
    }
    // const enemykeys = Object.keys(this.enemies);
    // enemykeys.forEach((enemy) => console.log(this.enemies[enemy].children));
    // console.log(
    //   `completed events = ${this.spawnManager.spawningTimeline?.totalComplete}`
    // );

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

  spawn(enemy: EnemyTypes, pathName: string) {
    // console.log(this.pathManager.pathNames);
    const enemyPath = this.pathManager.getPath(pathName);
    if (enemyPath === undefined) {
      console.log('the enemy path is undefined');
    } else {
      // const spawnedEnemy =
      this.enemies[enemy].spawnEnemy(enemyPath);
      // console.log(spawnedEnemy);
    }
  }

  addGraphics(graphics: Phaser.GameObjects.Graphics) {
    if (this.debugSettings.draw.grid === true) {
      LevelScene.drawGrid(graphics);
    }
    if (this.debugSettings.draw.paths === true) {
      this.pathManager.paths.forEach((path) => path.draw(graphics));
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
