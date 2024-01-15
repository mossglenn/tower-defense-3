import type Enemy from './Enemy.ts';

// eslint-disable-next-line no-unused-vars
export type TargetingMethodType = (a: Enemy, b: Enemy) => Enemy;
export type TargetingMethodsType = { [key: string]: TargetingMethodType };
export const TargetingMethods = {
  GetFirst: (a: Enemy, b: Enemy): Enemy =>
    a.pathCovered! > b.pathCovered! ? a : b,

  GetLast: (a: Enemy, b: Enemy): Enemy =>
    a.pathCovered! < b.pathCovered! ? a : b,

  GetClosest: (a: Enemy, b: Enemy): Enemy =>
    a.distanceToTower < b.distanceToTower ? a : b,

  GetFurthest: (a: Enemy, b: Enemy): Enemy =>
    a.distanceToTower > b.distanceToTower ? a : b,
} as const;
