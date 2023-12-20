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
          `at ${spawnEvent.at} spawning ${spawnEvent.enemy} on ${spawnEvent.path} path in ${scene.scene.key} `
        );
        // scene.enemies[spawnEvent.enemy].spawnEnemy(spawnEvent.path);
        scene.spawn(spawnEvent.enemy, spawnEvent.path);
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
    // console.log(`timeline config %O`, timelineConfig);
    return timelineConfig;
  }

  static checkDataNames(names: string[], data: SpawningTimelineData) {
    const errors: string[] = [];
    data.forEach((obj) => {
      if (!names.includes(obj.path)) {
        errors.push(
          `PATH NAME ERROR: data includes the path name: ${obj.path} that is not included in this level's named paths`
        );
      }
    });
    if (errors.length > 0) {
      return errors;
    }
    return undefined;
  }
}
