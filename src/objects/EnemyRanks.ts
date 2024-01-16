/* eslint-disable max-classes-per-file */
import Enemy from './Enemy.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export const Enemies = {
  ENEMY: 'enemy',
  GHOST: 'ghost',
  SCORPION: 'scorpion',
  EYE: 'eye',
} as const;

export type EnemyTypes = keyof typeof Enemies;

export const EnemiesConfig = {
  ENEMY: Enemies.ENEMY,
  GHOST: {
    key: Enemies.GHOST,
    startingHP: 100,
    speed: 10,
  },
  SCORPION: {
    key: Enemies.SCORPION,
    startingHP: 200,
    speed: 20,
  },
  EYE: {
    key: Enemies.EYE,
    startingHP: 100,
    speed: 10,
  },
} as const;

// 🏛️ Classes extenting Enemy

export class Ghost extends Enemy {
  startingHp: number = EnemiesConfig.GHOST.startingHP;

  speed: number = EnemiesConfig.GHOST.speed;

  constructor(levelscene: LevelScene, texture = EnemiesConfig.GHOST.key) {
    super(levelscene, texture);
  }
}

export class Scorpion extends Enemy {
  startingHp: number = EnemiesConfig.SCORPION.startingHP;

  speed: number = EnemiesConfig.SCORPION.speed;

  constructor(levelscene: LevelScene, texture = EnemiesConfig.SCORPION.key) {
    super(levelscene, texture);
  }
}

export class Eye extends Enemy {
  startingHp: number = EnemiesConfig.EYE.startingHP;

  speed: number = EnemiesConfig.EYE.speed;

  constructor(levelscene: LevelScene, texture = EnemiesConfig.EYE.key) {
    super(levelscene, texture);
  }
}

export const enemyGroupsConfig = {
  GHOST: {
    classType: Ghost,
    name: EnemiesConfig.GHOST.key,
    defaultKey: EnemiesConfig.GHOST.key,
  },
  SCORPION: {
    classType: Scorpion,
    name: EnemiesConfig.SCORPION.key,
    defaultKey: EnemiesConfig.SCORPION.key,
  },
  EYE: {
    classType: Eye,
    name: EnemiesConfig.EYE.key,
    defaultKey: EnemiesConfig.EYE.key,
  },
};
