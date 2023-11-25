import Phaser from 'phaser';

export default interface EnemyGroup {
  [index: string]: Phaser.Physics.Arcade.Group;
}
