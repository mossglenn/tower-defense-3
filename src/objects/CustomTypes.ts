import Phaser from 'phaser';
import type EnemyGroup from './EnemyGroup.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export type PathInfo = { name: string; points: Phaser.Math.Vector2[] };

export type PathsData = PathInfo[];

export interface EnemyGroups {
  [index: string]: EnemyGroup;
}

export type TimelineConfigPlus = Phaser.Types.Time.TimelineEventConfig & {
  type: string;
  path: string;
};

export const Enemies = {
  ENEMY: 'enemy',
  GHOST: 'ghost',
  SCORPION: 'scorpion',
  EYE: 'eye',
} as const;

export type EnemyTypes = (typeof Enemies)[keyof typeof Enemies];

export type SpawningTimelineData = {
  at: number;
  enemy: EnemyTypes;
  path: string;
}[];

export const Targeting = {
  FIRST: 'first',
  LAST: 'last',
  CLOSEST: 'closest',
  TARGET: 'target',
} as const;

export const CollisionCategories = {
  TERRAIN: 1,
  OBSTACLES: 2,
  TOWERS: 3,
} as const;

export const StandardDepths = {
  BUTTONS: 99,
  TURRET: 99,
  BASE: 98,
  ATTACKAREA: 97,
  SIDEBAR: 80,
  OBSTACLES: 70,
  TERRAIN: 60,
  BACKGROUND: 0,
} as const;

export type GameMapLayers = {
  background: Phaser.Tilemaps.TilemapLayer | null | undefined;
  terrain: Phaser.Tilemaps.TilemapLayer | null | undefined;
  towers: Phaser.Tilemaps.TilemapLayer | null | undefined;
  sidebar: Phaser.Tilemaps.TilemapLayer | null | undefined;
  obstacles: Phaser.Tilemaps.TilemapLayer | null | undefined;
};

export type TowerConfig = {
  name: string;
  scene: LevelScene;
  turrretTexture?: string;
  baseTexture?: string;
  x?: number;
  y?: number;
  towerScale?: number;
  range?: number;
};
