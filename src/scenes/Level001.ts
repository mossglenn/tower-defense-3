import Phaser from 'phaser';
import LevelScene from './LevelScene.ts';
import { SpawningTimelineData, Enemies } from '../objects/CustomTypes.ts';
import EnemyGroup from '../objects/EnemyGroup.ts';
import { Eye, Ghost, Scorpion } from '../objects/EnemyRanks.ts';
import SpawnManager from '../objects/SpawnManager.ts';

export default class Level001 extends LevelScene {
  tileAssets = {
    json: 'assets/tiles/overworld-tileset-collision-obstacle-paths.json',
    png: '/assets/tiles/overworld_tileset_grass.png',
    tilesetNames: ['overworld_tileset_grass'],
  };

  spawningTimelineData: SpawningTimelineData = [
    {
      at: 1000,
      enemy: Enemies.GHOST,
      path: 'pathOne',
    },
    {
      at: 2000,
      enemy: Enemies.SCORPION,
      path: 'pathTwo',
    },
    {
      at: 5000,
      enemy: Enemies.EYE,
      path: 'pathOne',
    },
  ];

  // map[row][col]
  towerMap: number[][] = [];

  constructor() {
    super('level001');
  }

  create(): void {
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

    this.map = this.make.tilemap({ key: 'tilemap' });
    const tileset = this.map.addTilesetImage(
      'overworld_tileset_grass',
      'tiles'
    );
    if (tileset !== null) {
      this.map.createLayer('background', tileset);
      this.map.createLayer('terrain', tileset);
      this.map.createLayer('collision', tileset);
    }

    super.create();
  }
}
