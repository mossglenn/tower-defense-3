import Phaser from 'phaser';

import PreloadScene from './scenes/Preloader.ts';
import Level001 from './scenes/Level001.ts';
import GameSettings from './GameSettings.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GameSettings.game.width,
  height: GameSettings.game.height,
  backgroundColor: '#4488AA',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },

  scene: [PreloadScene, Level001],
};

export default new Phaser.Game(config);
