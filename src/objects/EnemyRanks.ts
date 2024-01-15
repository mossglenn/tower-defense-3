/* eslint-disable max-classes-per-file */
import Enemy from './Enemy.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export class Ghost extends Enemy {
  startingHp: number = 200;

  speed: number = 10;

  constructor(levelscene: LevelScene, texture = 'ghost') {
    super(levelscene, texture);
  }
}

export class Scorpion extends Enemy {
  startingHp: number = 200;

  speed: number = 10;

  constructor(levelscene: LevelScene, texture = 'scorpion') {
    super(levelscene, texture);
  }
}

export class Eye extends Enemy {
  startingHp: number = 200;

  speed: number = 15;

  constructor(levelscene: LevelScene, texture = 'eye') {
    super(levelscene, texture);
  }
}
