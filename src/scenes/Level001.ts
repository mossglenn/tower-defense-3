import LevelScene from './LevelScene.ts';
import Ghost from '../objects/Ghost.ts';

export default class Level001 extends LevelScene {
  // map[row][col]
  towerMap = [
    [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
  ];

  pathPoints = [
    { x: 96, y: 0 },
    { x: 96, y: 164 },
    { x: 300, y: 164 },
    { x: 300, y: 300 },
    { x: 600, y: 300 },
    { x: 600, y: 576 },
  ];

  constructor() {
    super('level001');
  }

  create() {
    this.add.text(64, 64, 'Level 001');

    this.path = this.createPath();
    this.addGraphics();

    this.enemies.ghosts = this.physics.add.group({
      defaultKey: 'ghost',
      classType: Ghost,
    });
  }
}
