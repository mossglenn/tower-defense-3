import Phaser from 'phaser';
import {
  CollisionCategories,
  StandardDepths,
  Targeting,
  TowerConfig,
} from './CustomTypes.ts';
import type LevelScene from '../scenes/LevelScene.ts';

export default abstract class Tower extends Phaser.Physics.Arcade.Sprite {
  name: string;

  scene: LevelScene;

  base: Phaser.GameObjects.Sprite;

  range: number;

  attackArea: Phaser.GameObjects.Ellipse;

  towerScale: number;

  turretTexture: string;

  bullet: string = 'bullet';

  // decorations: string[] = [];

  rateOfFire: number = 10;

  targeting: keyof typeof Targeting = 'FIRST';

  blocked: boolean = false;

  notDraggedFromSourceZone: boolean = true;

  trashButton: Phaser.GameObjects.Image | undefined;

  correctButton: Phaser.GameObjects.Image | undefined;

  constructor(towerConfig: TowerConfig) {
    const defaults = {
      name: 'tower',
      turrretTexture: 'smallTurret',
      baseTexture: 'smallBase',
      x: 32,
      y: 32,
      towerScale: 1,
      range: 100,
    };
    const config = { ...defaults, ...towerConfig };
    super(config.scene, config.x, config.y, config.turrretTexture);
    this.name = config.name;
    this.scene = config.scene;
    this.towerScale = config.towerScale;
    this.turretTexture = config.turrretTexture;
    this.range = config.range;
    this.base = config.scene.add
      .sprite(config.x, config.y, config.baseTexture)
      .setScale(config.towerScale);
    this.scene.physics.add
      .existing(this)
      .setCircle(
        (this.width / 2) * config.towerScale,
        (this.width - this.width * config.towerScale) / 2,
        (this.width - this.width * config.towerScale) / 2
      )
      .setDepth(StandardDepths.TURRET)
      .setInteractive({ draggable: true })
      .setCollisionCategory(CollisionCategories.TOWERS)
      .setCollidesWith([
        CollisionCategories.TERRAIN,
        CollisionCategories.OBSTACLES,
        CollisionCategories.TOWERS,
      ]);
    this.scene.add.existing(this.base).setDepth(StandardDepths.BASE);
    this.attackArea = new Phaser.GameObjects.Ellipse(
      config.scene,
      config.x,
      config.y,
      config.range * 2,
      config.range * 2,
      0x000000,
      0.2
    );
    this.scene.add.existing(this.attackArea);
    this.attackArea
      .setVisible(false)
      .setDepth(StandardDepths.ATTACKAREA)
      .setStrokeStyle(2, 0x333333, 0.3);
    this.setScale(config.towerScale);

    this.on('dragleave', () => {
      if (this.notDraggedFromSourceZone) {
        this.notDraggedFromSourceZone = false;
        const eventName = `refresh_${this.name}`;
        this.emit(eventName);
        // console.log(
        //   `${eventName} emitting: ${this.name} is leaving the ${zone.name} zone`
        // );
      }
    });
    this.scene.towerManager.towerSourceGroup.add(this);
  }

  setDragAlpha(a: number = 0.8) {
    this.setAlpha(a);
    this.base.setAlpha(a);
  }

  startDrag() {
    this.setDragAlpha();
    this.attackArea.setVisible(false);
    this.correctButton?.setVisible(false);
    this.trashButton?.setVisible(false);
  }

  block() {
    const tint = 0x666666;
    this.blocked = true;
    this.setTint(tint);
    this.base.setTint(tint);
    this.attackArea.setVisible(false);
  }

  unblock() {
    this.blocked = false;
    this.clearTint();
    this.base.clearTint();
    this.attackArea.setVisible(true);
  }

  confirmDrop() {
    this.createButtons();
    this.trashButton
      ?.setPosition(this.x - 40, this.y)
      .setVisible(true)
      .setInteractive();
    this.correctButton?.setPosition(this.x + 40, this.y).setVisible(true);
  }

  dropTower() {
    this.scene.towerManager.moveTowerToDroppedGroup(this);
    this.scene.towerManager.unfreezeSourceTowers();
    this.correctButton?.destroy();
    this.trashButton?.destroy();
    this.setAlpha(1);
    this.base.setAlpha(1);
    this.disableInteractive();
    this.attackArea.setVisible(false);
  }

  dragTower(x: number, y: number) {
    // this.trashButton.setVisible(false);
    // this.correctButton.setVisible(false);
    this.x = x;
    this.y = y;
    this.base.x = x;
    this.base.y = y;
    this.attackArea.x = x;
    this.attackArea.y = y;
  }

  createButtons() {
    if (this.trashButton === undefined) {
      this.trashButton = new Phaser.GameObjects.Image(
        this.scene,
        this.x - 40,
        this.y,
        'trashbin'
      );
      this.trashButton
        .setDisplaySize(32, 32)
        .setVisible(false)
        .setDepth(StandardDepths.BUTTONS);
      this.trashButton.on('pointerup', () => {
        this.scene.towerManager.unfreezeSourceTowers();
        Tower.destroyTower(this);
      });
      this.scene.add.existing(this.trashButton);
    }

    if (this.correctButton === undefined) {
      this.correctButton = new Phaser.GameObjects.Image(
        this.scene,
        this.x + 40,
        this.y,
        'correct'
      );
      this.correctButton
        .setDisplaySize(32, 32)
        .setVisible(false)
        .setDepth(StandardDepths.BUTTONS)
        .setInteractive();
      this.correctButton.on('pointerup', () => this.dropTower());
      this.scene.add.existing(this.correctButton);
    }
  }

  static destroyTower(tower: Tower) {
    tower.trashButton?.destroy();
    tower.correctButton?.destroy();
    tower.base.destroy();
    tower.attackArea.destroy();
    tower.destroy();
  }

  findTarget() {
    const method = this.targeting;
    console.log(`looking for ${method} enemy`);
  }
}
