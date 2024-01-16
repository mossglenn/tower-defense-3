import LevelScene from './LevelScene.ts';
import { SpawningTimelineData } from '../objects/CustomTypes.ts';

export default class Level001 extends LevelScene {
  tileAssets = {
    json: '/assets/tiles/tower3tiledmap.json',
    png: '/assets/tiles/towerDefense_tilesheet.png',
    tilesetNames: ['towerDefense_tilesheet'],
    pathMarkerSize: 64,
  };

  levelTowers: string[] = [];

  spawningTimelineData: SpawningTimelineData = [
    {
      at: 1000,
      enemy: 'GHOST',
      path: 'pathOne',
    },
    {
      at: 5000,
      enemy: 'SCORPION',
      path: 'pathTwo',
    },
    {
      at: 9000,
      enemy: 'EYE',
      path: 'pathOne',
    },
  ];

  constructor() {
    super('level001');
  }

  create(): void {
    super.create();
  }
}
