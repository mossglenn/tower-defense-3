import Phaser from 'phaser';
import * as TowerClasses from './TowerRanks.ts';
import GameSettings from '../GameSettings.ts';
import Tower from './Tower.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export default class TowerManager {
  scene: LevelScene;

  towerClasses = TowerClasses;

  towerSourceGroup: Phaser.Physics.Arcade.Group;

  towerPlacedGroup: Phaser.Physics.Arcade.Group;

  sourceZones: Phaser.GameObjects.Zone[] = [];

  constructor(world: Phaser.Physics.Arcade.World, scene: LevelScene) {
    this.scene = scene;
    this.towerSourceGroup = new Phaser.Physics.Arcade.Group(world, scene);
    this.towerSourceGroup.runChildUpdate = true;
    this.towerPlacedGroup = new Phaser.Physics.Arcade.Group(world, scene);
    this.towerPlacedGroup.runChildUpdate = true;
  }

  createSourceZones(keys: string[]) {
    if (keys.length < 1) {
      keys.push(...GameSettings.sidebar.sourceZones.map((item) => item.name));
    }
    keys.forEach((key) => this.createSourceZone(key));
  }

  createSourceZone(key: string = 'potatogun') {
    const settings = GameSettings.sidebar.sourceZones.find(
      (obj) => obj.name === key
    );
    if (settings) {
      const { x, y } = settings.origin;
      const sourceZone = new Phaser.GameObjects.Zone(this.scene, x, y, 64, 64);
      sourceZone.name = settings.name;
      sourceZone.setInteractive();
      if (sourceZone.input) {
        sourceZone.input!.dropZone = true;
      } else {
        console.log('zone failed to be interactive');
      }
      this.scene.add.existing(sourceZone);
      this.sourceZones.push(sourceZone);
      const FunctionHolder = settings.class;

      this.scene.add.existing(new FunctionHolder(this.scene));
    } else {
      console.log('unable to find appropriate game settings for source zone');
    }
  }

  freezeAllNonDraggingSourceTowers(draggingTower: Tower) {
    const frozenTowers = this.towerSourceGroup
      .getChildren()
      .filter((tower) => tower !== draggingTower);

    frozenTowers.map((tower) => tower.disableInteractive());
    console.log(frozenTowers);
  }

  unfreezeSourceTowers() {
    this.towerSourceGroup.getChildren().map((tower) => tower.setInteractive());
  }

  // getTowerClass(className: string) {
  //   const classesArray = Object.entries(this.towerClasses);
  //   const classArray = classesArray.find(
  //     (subarray) => subarray[0] === className
  //   );
  //   if (classArray === undefined) {
  //     return Tower;
  //   }
  //   return classArray[1];
  // }

  moveTowerToDroppedGroup(tower: Tower) {
    this.towerSourceGroup.remove(tower);
    this.towerPlacedGroup.add(tower);
  }
}
