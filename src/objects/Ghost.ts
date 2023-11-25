import LevelScene from '../scenes/LevelScene.ts';
import Enemy from './Enemy.ts';

export default class Ghost extends Enemy {
  startingHp: number = 300;

  timeBetweenSpawning: number = 1500;

  constructor(scene: LevelScene, texture = 'ghost') {
    super(scene, texture);
  }
}
