import Enemy from './Enemy.ts';

export default class SpawnManager {
  static recurringSpawn(enemy: Enemy, timeBetweenSpawnings: number) {
    return {
      type: enemy,
      interval: timeBetweenSpawnings,
      timeOfNextSpawn: timeBetweenSpawnings,
      spawner(time: number) {
        if (time >= this.timeOfNextSpawn) {
          console.log(`Spawning  ${enemy.key}`);
          //          enemy.spawn();
        }
      },
    };
  }
}
