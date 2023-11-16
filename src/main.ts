import Phaser from 'phaser';

import PreloadScene from './scenes/Preloader.ts';
import HelloWorld from './scenes/HelloWorldScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 768,
  height: 576,
  backgroundColor: '#4488AA',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [PreloadScene, HelloWorld],
};

export default new Phaser.Game(config);
