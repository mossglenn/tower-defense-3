import Phaser from 'phaser';
import Enemy from './Enemy.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
  levelscene: LevelScene;

  constructor(
    world: Phaser.Physics.Arcade.World,
    levelscene: LevelScene,
    config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {}
  ) {
    const defaultConfig: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {
      classType: Enemy,
      name: 'enemies',
      defaultKey: 'enemy',
      runChildUpdate: true,
      immovable: true,
    };
    super(world, levelscene, Object.assign(defaultConfig, config));
    this.levelscene = levelscene;
  }

  spawnEnemy(enemyPath: Phaser.Curves.Path) {
    const spawnedEnemy: Enemy = this.get();
    if (spawnedEnemy) {
      spawnedEnemy.setPath(enemyPath);
      spawnedEnemy.setTexture(this.defaultKey);
      spawnedEnemy.body!.setSize();
      spawnedEnemy.setActive(true);
      spawnedEnemy.setVisible(true);
      this.levelscene.visibleEnemies.add(spawnedEnemy);
    }
    return spawnedEnemy;
  }
}
