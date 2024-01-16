import Phaser from 'phaser';
import {
  CollisionCategories,
  GameMapLayers,
  SpawningTimelineData,
  StandardDepths,
  EnemyGroups,
} from '../objects/CustomTypes.ts';
import type Tower from '../objects/Tower.ts';
import PathManager from '../objects/PathManager.ts';
import SpawnManager from '../objects/SpawnManager.ts';
import GameSettings from '../GameSettings.ts';
import TowerManager from '../objects/TowerManager.ts';
import Bullet from '../objects/Bullet.ts';
import Enemy from '../objects/Enemy.ts';
import EnemyGroup from '../objects/EnemyGroup.ts';
import { enemyGroupsConfig, EnemyTypes } from '../objects/EnemyRanks.ts';

export default class LevelScene extends Phaser.Scene {
  // level-specific assets
  tileAssets!: {
    json: string;
    png: string;
    tilesetNames: string[];
    pathMarkerSize: number;
  };

  spawningTimelineData!: SpawningTimelineData;

  levelTowers!: string[];

  // map and layers
  map?: Phaser.Tilemaps.Tilemap;

  gameMapLayers: GameMapLayers = {
    background: null,
    terrain: null,
    towers: null,
    obstacles: null,
    sidebar: null,
  };

  pathManager = new PathManager();

  // spawning enemies

  spawnManager = new SpawnManager();

  enemies: EnemyGroups = {};

  visibleEnemies = new Phaser.GameObjects.Group(this);

  // towers

  towerManager!: TowerManager;

  bulletGroup?: Phaser.Physics.Arcade.Group;

  // interface

  playbutton?: Phaser.GameObjects.Image;

  // debugging

  graphics?: Phaser.GameObjects.Graphics;

  debugSettings = {
    draw: {
      grid: false,
      paths: false,
    },
    log: true,
  };

  // timeScale //TODO: allow player to speedup and slow down timescale

  constructor(sceneKey: string = 'levelscene') {
    super(sceneKey);
  }

  preload() {
    this.load.image('tiles', this.tileAssets.png);
    this.load.tilemapTiledJSON('tilemap', this.tileAssets.json);
  }

  create() {
    this.towerManager = new TowerManager(this.physics.world, this);

    this.graphics = this.add.graphics();

    if (this.debugSettings.draw.grid) {
      LevelScene.drawGrid(this.graphics!);
    }

    // 🧩 set up tilemap
    this.map = this.make.tilemap({ key: 'tilemap' });
    const tileset = this.map.addTilesetImage(
      this.tileAssets.tilesetNames[0],
      'tiles'
    );
    if (tileset !== null) {
      this.gameMapLayers.background = this.map
        .createLayer('background', tileset)
        ?.setVisible(true);
      this.gameMapLayers.sidebar = this.map
        .createLayer('sidebar', tileset)
        ?.setDepth(StandardDepths.SIDEBAR); // TODO: allow scrolling sidebar
      this.gameMapLayers.terrain = this.map
        .createLayer('terrain', tileset)
        ?.setCollisionCategory(CollisionCategories.TERRAIN);
      this.gameMapLayers.obstacles = this.map
        .createLayer('obstacles', tileset)
        ?.setDepth(StandardDepths.OBSTACLES);
      // TODO: Add collision layer to map
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
    } else {
      console.log('paths cannot be set up while map is undefined');
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
    // TODO: think about moving creation of enemy group into spawnmanager or into gamesettings
    this.enemies.GHOST = new EnemyGroup(
      this.physics.world,
      this,
      enemyGroupsConfig.GHOST
    );
    this.enemies.SCORPION = new EnemyGroup(
      this.physics.world,
      this,
      enemyGroupsConfig.SCORPION
    );
    this.enemies.EYE = new EnemyGroup(
      this.physics.world,
      this,
      enemyGroupsConfig.EYE
    );
    Object.keys(this.enemies).forEach((enemy) =>
      this.add.existing(this.enemies[enemy])
    );

    // bullet collider
    this.bulletGroup = this.physics.add.group();

    this.physics.add.overlap(this.bulletGroup, this.visibleEnemies, (e, b) => {
      console.log(`hit`);
      const bullet = b as Bullet;
      const enemy = e as Enemy;
      enemy.damage(bullet.damage);
      bullet.destroy();
    });

    // 🧩 prepare spawn timeline
    this.spawnManager.createTimeline(this, this.spawningTimelineData);

    // 🧩 create towers in sidebar
    this.towerManager.createSourceZones(this.levelTowers);

    // 🧩 create play button
    this.playbutton = this.add
      .image(GameSettings.game.width / 2, GameSettings.game.height / 2, 'play')
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        if (this.spawnManager.spawningTimeline !== undefined) {
          this.spawnManager.spawningTimeline.play();
          this.playbutton?.destroy();
        }
      });

    // 🧩 input
    // TODO: thik about moving ALL tower input to tower class
    this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, obj: Tower) => {
      this.towerManager.freezeAllNonDraggingSourceTowers(obj);
      obj.startDrag();
    });
    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, obj: Tower) => {
      if (obj.blocked) {
        obj.setDragAlpha();
      } else {
        obj.disableInteractive();
        obj.setInteractive();
        obj.confirmDrop();
      }
    });

    // TODO: think about moving tower drag input to Tower class
    this.input.on(
      'drag',
      (
        _pointer: Phaser.Input.Pointer,
        tower: Tower,
        dragX: number,
        dragY: number
      ) => {
        tower.dragTower(dragX, dragY);
        if (this.checkIsOverlapping(tower)) {
          tower.block();
        } else {
          tower.unblock();
        }
      }
    );
  }

  update(_time: number, _delta: number): void {
    // console.log(
    //   `visibleEnemies length: ${this.visibleEnemies.getChildren().length}`
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
    const enemyPath = this.pathManager.getPath(pathName);
    if (enemyPath === undefined) {
      console.log('the enemy path is undefined');
    } else {
      this.enemies[enemy].spawnEnemy(enemyPath);
    }
  }

  checkIsOverlapping(tower: Tower) {
    const isOverlappingTile = this.physics.world.overlapTiles(tower, [
      ...this.gameMapLayers.terrain!.culledTiles,
      ...this.gameMapLayers.sidebar!.culledTiles,
      ...this.gameMapLayers.obstacles!.culledTiles, // TODO use hitbox instead of whole tile
    ]);
    const isOverlappingTower = this.physics.world.overlap(
      tower,
      this.towerManager.towerPlacedGroup
    );
    if (isOverlappingTile || isOverlappingTower) {
      return true;
    }
    return false;
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
