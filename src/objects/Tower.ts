import Phaser from 'phaser';
import { CollisionCategories, Targeting, TowerConfig } from './CustomTypes.ts';

export default abstract class Tower extends Phaser.Physics.Arcade.Sprite {
  name: string;

  scene: Phaser.Scene;

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

  // depth: number = 50;

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
      .setDepth(99)
      .setInteractive({ draggable: true })
      .setCollisionCategory(CollisionCategories.TOWERS)
      .setCollidesWith([
        CollisionCategories.TERRAIN,
        CollisionCategories.OBSTACLES,
        CollisionCategories.TOWERS,
      ]);
    this.scene.add.existing(this.base).setDepth(98);
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
    this.attackArea.setVisible(false).setStrokeStyle(2, 0x333333, 0.3);
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
  }

  setDragAlpha(a: number = 0.8) {
    this.setAlpha(a);
    this.base.setAlpha(a);
  }

  startDrag() {
    this.setDragAlpha();
    this.attackArea.setVisible(false);
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
    const correctButton = new Phaser.GameObjects.Image(
      this.scene,
      this.x + 40,
      this.y,
      'correct'
    );
    correctButton.setDisplaySize(32, 32).setInteractive();
    this.scene.add.existing(correctButton);

    const trashButton = new Phaser.GameObjects.Image(
      this.scene,
      this.x - 40,
      this.y,
      'trashbin'
    );
    trashButton.setDisplaySize(32, 32).setInteractive();
    this.scene.add.existing(trashButton);

    correctButton.on('pointerup', () => {
      correctButton.destroy();
      trashButton.destroy();
      this.dropTower();
    });

    trashButton.on('pointerup', () => {
      correctButton.destroy();
      trashButton.destroy();
      Tower.destroyTower(this);
    });
  }

  dropTower() {
    this.setAlpha(1);
    this.base.setAlpha(1);
    this.disableInteractive();
    this.attackArea.setVisible(false);
  }

  dragTower(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.base.x = x;
    this.base.y = y;
    this.attackArea.x = x;
    this.attackArea.y = y;
  }

  static destroyTower(tower: Tower) {
    tower.base.destroy();
    tower.attackArea.destroy();
    tower.destroy();
  }

  findTarget() {
    const method = this.targeting;
    console.log(`looking for ${method} enemy`);
  }
}
