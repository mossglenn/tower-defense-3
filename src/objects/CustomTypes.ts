import Phaser from 'phaser';

import EnemyGroup from './EnemyGroup.ts';

export type NamedPaths = {
  [index: string]: Phaser.Curves.Path;
};

export type PathPoints = { x: number; y: number }[];

export type PathInfo = { name: string; points: PathPoints };

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
} as const;

export type EnemyTypes = (typeof Enemies)[keyof typeof Enemies];

export type SpawningTimelineData = {
  at: number;
  enemy: EnemyTypes;
  path: string;
  event: string;
}[];
