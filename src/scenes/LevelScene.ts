import Phaser from 'phaser';
import {
  Enemies,
  EnemyGroups,
  EnemyTypes,
  GameMapLayers,
  SpawningTimelineData,
} from '../objects/CustomTypes.ts';
import EnemyGroup from '../objects/EnemyGroup.ts';
import { Eye, Ghost, Scorpion } from '../objects/EnemyRanks.ts';
import Tower from '../objects/Tower.ts';
import PathManager from '../objects/PathManager.ts';
import SpawnManager from '../objects/SpawnManager.ts';
import GameSettings from '../GameSettings.ts';
import TowerManager from '../objects/TowerManager.ts';

export default class LevelScene extends Phaser.Scene {
  tileAssets!: {
    json: string;
    png: string;
    tilesetNames: string[];
    pathMarkerSize: number;
  };

  map?: Phaser.Tilemaps.Tilemap;

  gameMapLayers: GameMapLayers = {
    background: null,
    terrain: null,
    towers: null,
    obstacles: null,
    sidebar: null,
  };

  spawningTimelineData!: SpawningTimelineData;

  spawnManager = new SpawnManager();

  enemies: EnemyGroups = {};

  towerManager = new TowerManager();

  pathManager = new PathManager();

  graphics?: Phaser.GameObjects.Graphics;

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
    this.graphics = this.add.graphics();

    if (this.debugSettings.draw.grid) {
      LevelScene.drawGrid(this.graphics!);
    }

    // 🧩 set up paths
    if (this.map !== undefined) {
      this.pathManager.addPathsFromMapLayers(
        this.tileAssets.pathMarkerSize / 2,
        this.map.objects
          .filter((layer) => layer.name.startsWith('path'))
          .map((layer): Phaser.Tilemaps.ObjectLayer | null =>
            this.map!.getObjectLayer(layer.name)
          )
          .filter((l) => l != null) as Phaser.Tilemaps.ObjectLayer[] // nulls are removed so forcing type is safe
      );

      const pathNameErrors = SpawnManager.checkDataNames(
        this.pathManager.pathNames,
        this.spawningTimelineData
      );

      if (pathNameErrors !== undefined) {
        pathNameErrors.forEach((error) => console.error(error));
      }
    }

    if (this.debugSettings.draw.paths) {
      this.pathManager.paths.forEach((path) => {
        path.draw(this.graphics!);
        const pathPoints: { x: number; y: number }[] = [];
        path.curves.forEach((curve: any) => {
          pathPoints.push(curve.p0, curve.p1);
        });

        console.log(pathPoints);
      });
    }

    // 🧩 Creating all enemy groups
    this.enemies.ghost = new EnemyGroup(this.physics.world, this, {
      classType: Ghost,
      name: Enemies.GHOST,
      defaultKey: Enemies.GHOST,
    });
    this.enemies.scorpion = new EnemyGroup(this.physics.world, this, {
      classType: Scorpion,
      name: Enemies.SCORPION,
      defaultKey: Enemies.SCORPION,
    });
    this.enemies.eye = new EnemyGroup(this.physics.world, this, {
      classType: Eye,
      name: Enemies.EYE,
      defaultKey: Enemies.EYE,
    });
    Object.keys(this.enemies).forEach((enemy) =>
      this.add.existing(this.enemies[enemy])
    );

    // 🧩 prepare spawn timeline
    this.spawnManager.createTimeline(this, this.spawningTimelineData);
    if (this.spawnManager.spawningTimeline !== undefined) {
      this.spawnManager.spawningTimeline.play();
    }

    // 🧩 input and colliders
    this.input.on(
      'drag',
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Tower,
        dragX: number,
        dragY: number
      ) => {
        gameObject.dragTower(dragX, dragY);
      }
    );
  }

  update(time: number, _delta: number): void {
    if (this.updatedtime) {
      this.updatedtime.setText(Math.floor(time).toString());
    }

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

  static drawGrid(graphics: Phaser.GameObjects.Graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.2);
    for (let i = 0; i < GameSettings.game.height / 64; i += 1) {
      graphics.moveTo(0, i * 64);
      graphics.lineTo(GameSettings.game.width, i * 64);
    }
    for (let j = 0; j < GameSettings.game.width / 64; j += 1) {
      graphics.moveTo(j * 64, 0);
      graphics.lineTo(j * 64, GameSettings.game.height);
    }
    graphics.strokePath();
  }
}
