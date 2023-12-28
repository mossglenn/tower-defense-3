import LevelScene from './LevelScene.ts';
import {
  SpawningTimelineData,
  Enemies,
  CollisionCategories,
} from '../objects/CustomTypes.ts';
import { Popgun, PotatoGun, Shotgun } from '../objects/TowerRanks.ts';

export default class Level001 extends LevelScene {
  tileAssets = {
    json: '/assets/tiles/tower3tiledmap.json',
    png: '/assets/tiles/towerDefense_tilesheet.png',
    tilesetNames: ['towerDefense_tilesheet'],
    pathMarkerSize: 64,
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

  constructor() {
    super('level001');
  }

  create(): void {
    this.map = this.make.tilemap({ key: 'tilemap' });
    const tileset = this.map.addTilesetImage('towerDefense_tilesheet', 'tiles');
    if (tileset !== null) {
      this.gameMapLayers.background = this.map
        .createLayer('background', tileset)
        ?.setVisible(true);
      this.gameMapLayers.towers = this.map
        .createLayer('towers', tileset)
        ?.setDepth(88);
      this.gameMapLayers.sidebar = this.map
        .createLayer('sidebar', tileset)
        ?.setDepth(77);
      this.gameMapLayers.terrain = this.map
        .createLayer('terrain', tileset)
        ?.setCollisionCategory(CollisionCategories.TERRAIN);
    }
    this.towerManager.towers.push(new PotatoGun(this));
    this.towerManager.towers.push(new Shotgun(this));
    this.towerManager.towers.push(new Popgun(this));

    // this.physics.add.existing(testTower);

    super.create();
  }
}
