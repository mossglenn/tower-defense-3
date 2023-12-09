import LevelScene from './LevelScene.ts';
import {
  PathsData,
  SpawningTimelineData,
  Enemies,
} from '../objects/CustomTypes.ts';
import EnemyGroup from '../objects/EnemyGroup.ts';
import Ghost from '../objects/Ghost.ts';

export default class Level001 extends LevelScene {
  pathsData: PathsData = [
    {
      name: 'top',
      points: [
        { x: 96, y: 0 },
        { x: 96, y: 164 },
        { x: 300, y: 164 },
        { x: 300, y: 250 },
        { x: 600, y: 250 },
        { x: 600, y: 576 },
      ],
    },
    {
      name: 'bottom',
      points: [
        { x: 36, y: 0 },
        { x: 36, y: 200 },
        { x: 150, y: 200 },
        { x: 150, y: 300 },
        { x: 300, y: 300 },
        { x: 300, y: 576 },
      ],
    },
  ];

  spawningTimelineData: SpawningTimelineData = [
    {
      at: 1000,
      enemy: Enemies.GHOST,
      path: 'top',
      event: 'SPAWN_GHOST',
    },
    {
      at: 2000,
      enemy: Enemies.GHOST,
      path: 'bottom',
      event: 'SPAWN_GHOST',
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
    super.create();
  }
}
