import Phaser from 'phaser';
import * as TowerClasses from './TowerRanks.ts';
import GameSettings from '../GameSettings.ts';
import Tower from './Tower.ts';

export default class TowerManager {
  scene: Phaser.Scene;

  towerClasses = TowerClasses;

  towerSourceGroup: Phaser.Physics.Arcade.Group;

  towerPlacedGroup: Phaser.Physics.Arcade.Group;

  sourceZones: Phaser.GameObjects.Zone[] = [];

  constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene) {
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
    // TODO: THIS IS WHERE YOU STOPPED
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

  getTowerClass(className: string) {
    const classesArray = Object.entries(this.towerClasses);
    const classArray = classesArray.find(
      (subarray) => subarray[0] === className
    );
    if (classArray === undefined) {
      return Tower;
    }
    return classArray[1];
  }
}
