import Phaser from 'phaser';
import LevelScene from './LevelScene.ts';
import { CollisionCategories } from '../objects/CustomTypes.ts';

export default class Sidebar extends Phaser.Scene {
  levelKey: string;

  level?: LevelScene;

  constructor(sceneKey: string = 'sidebar', levelKey: string = 'level001') {
    super(sceneKey);
    this.levelKey = levelKey;
  }

  preload() {
    this.load.image('tower', 'assets/sprites/tower64.png');
  }

  create() {
    this.level = this.scene.get(this.levelKey) as LevelScene;

    this.scene.bringToTop(this);
    const testTower = this.physics.add
      .sprite(32, 32, 'tower')
      .setInteractive({ draggable: true })
      .addCollidesWith(CollisionCategories.TERRAIN);

    if (this.level.mapTerrain) {
      this.physics.add.overlap(
        testTower,
        this.level.mapTerrain,
        (tower, tile) => {
          if (tile.index > 0) {
            console.log('overlap!!');
            console.log(tower);
            console.log(tile);
            tower.setAlpha(0.5);
          }
        }
      );
    } else {
      console.log('error adding collider for tower');
    }

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.setPosition(dragX, dragY); // .setAlpha(0.5);
    });
  }
}
