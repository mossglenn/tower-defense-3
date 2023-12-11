import LevelScene from './LevelScene.ts';
import {
  PathsData,
  SpawningTimelineData,
  Enemies,
} from '../objects/CustomTypes.ts';
import EnemyGroup from '../objects/EnemyGroup.ts';
import { Eye, Ghost, Scorpion } from '../objects/EnemyRanks.ts';

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
    },
    {
      at: 2000,
      enemy: Enemies.SCORPION,
      path: 'bottom',
    },
    {
      at: 5000,
      enemy: Enemies.EYE,
      path: 'top',
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
    super.create();
  }
}
