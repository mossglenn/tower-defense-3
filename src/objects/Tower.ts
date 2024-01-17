import Phaser from 'phaser';
import {
  CollisionCategories,
  StandardDepths,
  TowerConfig,
} from './CustomTypes.ts';
import type LevelScene from '../scenes/LevelScene.ts';
import * as Bullets from './BulletRanks.ts';
import { BulletTypes } from './BulletRanks.ts';
import Enemy from './Enemy.ts';
import { TargetingMethodType, TargetingMethods } from './TargetingMethod.ts';

export default abstract class Tower extends Phaser.Physics.Arcade.Sprite {
  name: string;

  levelscene: LevelScene;

  base: Phaser.GameObjects.Sprite;

  range: number;

  attackArea: Phaser.GameObjects.Ellipse;

  towerScale: number;

  turretTexture: string;

  bulletClass: BulletTypes;

  // TODO: add decoration with buffs: decorations: string[] = [];

  rateOfFire: number;

  targeting: TargetingMethodType = TargetingMethods.GetFirst; // TODO: allow player to choose targeting method

  firingTimer: Phaser.Time.TimerEvent;

  firingTimerConfig: Phaser.Types.Time.TimerEventConfig;

  blocked: boolean = false;

  notDraggedFromSourceZone: boolean = true;

  trashButton: Phaser.GameObjects.Image | undefined;

  correctButton: Phaser.GameObjects.Image | undefined;

  // TODO: think about adding target information that could be used between shots for rotation and used by shots, too
  #targetable: Enemy[] = [];

  #target?: Enemy;

  constructor(towerConfig: TowerConfig) {
    const defaults = {
      name: 'tower',
      turrretTexture: 'smallTurret',
      baseTexture: 'smallBase',
      bulletClass: Bullets.BulletClasses.POTATO,
      x: 32,
      y: 32,
      towerScale: 1,
      range: 200,
      rateOfFire: 1000,
    };
    const config = { ...defaults, ...towerConfig };
    super(config.levelscene, config.x, config.y, config.turrretTexture);
    this.name = config.name;
    this.levelscene = config.levelscene;
    this.towerScale = config.towerScale;
    this.turretTexture = config.turrretTexture;
    this.range = config.range;
    this.rateOfFire = config.rateOfFire;
    this.bulletClass = config.bulletClass;
    this.base = config.levelscene.add
      .sprite(config.x, config.y, config.baseTexture)
      .setScale(config.towerScale);
    this.levelscene.physics.add
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
    this.levelscene.add.existing(this.base).setDepth(StandardDepths.BASE);

    this.attackArea = new Phaser.GameObjects.Ellipse(
      config.levelscene,
      config.x,
      config.y,
      config.range * 2,
      config.range * 2,
      0x000000,
      0.2
    );
    this.levelscene.physics.add.existing(this.attackArea);
    this.attackArea
      .setVisible(false)
      .setDepth(StandardDepths.ATTACKAREA)
      .setStrokeStyle(2, 0x333333, 0.3);
    if (this.attackArea.body instanceof Phaser.Physics.Arcade.Body) {
      this.attackArea.body.setCircle(this.range);
    }

    this.firingTimerConfig = {
      delay: this.rateOfFire,
      loop: true,
      callback: this.fire,
      callbackScope: this,
      startAt: this.rateOfFire - 500,
    };
    this.firingTimer = this.levelscene.time.addEvent(this.firingTimerConfig);
    this.firingTimer.paused = true;

    this.setScale(config.towerScale);

    // TODO: move tower input here

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
    this.levelscene.towerManager.towerSourceGroup.add(this);
  }

  update() {
    this.findTarget();
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
    this.levelscene.towerManager.moveTowerToDroppedGroup(this);
    if (this.levelscene.debugSettings.log) {
      const success =
        this.levelscene.towerManager.towerPlacedGroup.contains(this);
      console.log(
        `placing tower: ${this.name} using bullets: ${this.bulletClass.name}. Now in Place Group: ${success}`
      );
    }
    this.levelscene.towerManager.unfreezeSourceTowers();
    this.correctButton?.destroy();
    this.trashButton?.destroy();
    this.setAlpha(1);
    this.base.setAlpha(1);
    this.disableInteractive();
    this.attackArea.setVisible(false);
    this.firingTimer.paused = false;
  }

  dragTower(x: number, y: number) {
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
        this.levelscene,
        this.x - 40,
        this.y,
        'trashbin'
      );
      this.trashButton
        .setDisplaySize(32, 32)
        .setVisible(false)
        .setDepth(StandardDepths.BUTTONS);
      this.trashButton.on('pointerup', () => {
        this.levelscene.towerManager.unfreezeSourceTowers();
        Tower.destroyTower(this);
      });
      this.levelscene.add.existing(this.trashButton);
    }

    if (this.correctButton === undefined) {
      this.correctButton = new Phaser.GameObjects.Image(
        this.levelscene,
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
      this.levelscene.add.existing(this.correctButton);
    }
  }

  static destroyTower(tower: Tower) {
    tower.trashButton?.destroy();
    tower.correctButton?.destroy();
    tower.base.destroy();
    tower.attackArea.destroy();
    tower.destroy();
  }

  collectTargetableGroup() {
    const enemies = this.levelscene.visibleEnemies.getChildren() as Enemy[];
    const enemiesInRange = enemies.filter(
      (enemy) =>
        Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <
        this.range
    );
    if (enemiesInRange.length < 1) {
      this.firingTimer.paused = true;
    } else {
      this.firingTimer.paused = false;
    }

    this.#targetable = enemiesInRange;
  }

  findTarget() {
    this.collectTargetableGroup();
    if (
      this.#targetable.length > 0 &&
      (this.targeting === TargetingMethods.GetClosest ||
        this.targeting === TargetingMethods.GetFurthest)
    ) {
      this.#targetable.forEach((e) => {
        const enemy = e as Enemy;
        enemy.distanceToTower = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          enemy.x,
          enemy.y
        );
      });
    }
    const newTarget: Enemy | undefined =
      this.#targetable.length > 0
        ? this.#targetable.reduce(this.targeting)
        : undefined;
    // console.log(
    //   `${this.name} found ${this.targeting.name} enemy: ${newTarget?.constructor.name}`
    // );
    this.#target = newTarget;
    this.turnTowardsTarget();
  }

  turnTowardsTarget() {
    if (this.#target !== undefined) {
      this.rotation = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.#target.x,
        this.#target.y
      );
    }
  }

  createBullet() {
    // eslint-disable-next-line new-cap
    const bullet = new this.bulletClass(this.levelscene, this.x, this.y);
    this.levelscene.physics.add.existing(bullet);
    this.levelscene.bulletGroup.add(bullet);
    return bullet;
  }

  fire() {
    if (this.#target !== undefined) {
      const bullet = this.createBullet();
      const angle = this.levelscene.physics.moveToObject(
        bullet,
        this.#target,
        bullet.speed
      );
      bullet.setRotation(angle);
      this.setRotation(angle);
    }
  }
}
