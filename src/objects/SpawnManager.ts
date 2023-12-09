import Phaser from 'phaser';
import { SpawningTimelineData, EnemyTypes } from './CustomTypes.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export default class SpawnManager {
  data?: SpawningTimelineData;

  spawningTimeline?: Phaser.Time.Timeline;

  scene?: LevelScene;

  timelineConfig?: Phaser.Types.Time.TimelineEventConfig[];

  createTimeline(scene: LevelScene, data: SpawningTimelineData) {
    this.scene = scene;
    this.timelineConfig = this.buildTimelineConfig(data);

    this.spawningTimeline = new Phaser.Time.Timeline(
      scene,
      this.timelineConfig
    );
  }

  static convertSpawnEventToTimelineEvent(
    spawnEvent: {
      at: number;
      enemy: EnemyTypes;
      path: string;
    },
    scene: LevelScene
  ): Phaser.Types.Time.TimelineEventConfig {
    return {
      at: spawnEvent.at,
      run: () => {
        console.log(
          `spawning ${spawnEvent.enemy} on ${spawnEvent.path} path in ${scene.scene.key} `
        );
        scene.enemies[spawnEvent.enemy].spawnEnemy(spawnEvent.path);
      },
    };
  }

  buildTimelineConfig(data: SpawningTimelineData) {
    if (data === undefined || this.scene === undefined) {
      console.log('OOPS! trying to build the timeline config too eaarly');
      return [];
    }
    const timelineConfig = data.map((spawnEvent) =>
      SpawnManager.convertSpawnEventToTimelineEvent(spawnEvent, this.scene!)
    );
    console.log(`timeline config %O`, timelineConfig);
    return timelineConfig;
  }
}
