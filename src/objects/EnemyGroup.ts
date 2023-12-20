import Phaser from 'phaser';
import Enemy from './Enemy.ts';

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(
    world: Phaser.Physics.Arcade.World,
    scene: Phaser.Scene,
    config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {}
  ) {
    const defaultConfig: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {
      classType: Enemy,
      name: 'enemies',
      defaultKey: 'enemy',
      runChildUpdate: true,
      immovable: true,
    };
    super(world, scene, Object.assign(defaultConfig, config));
  }

  spawnEnemy(enemyPath: Phaser.Curves.Path) {
    const spawnedEnemy: Enemy = this.get();
    if (spawnedEnemy) {
      spawnedEnemy.setPath(enemyPath);
      spawnedEnemy.setTexture(this.defaultKey);
      spawnedEnemy.body!.setSize();
      spawnedEnemy.setActive(true);
      spawnedEnemy.setVisible(true);
    }
    return spawnedEnemy;
  }
}
