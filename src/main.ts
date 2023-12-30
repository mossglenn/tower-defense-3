import Phaser, { Scale } from 'phaser';

import Level001 from './scenes/Level001.ts';
import GameSettings from './GameSettings.ts';
import Preloader from './scenes/Preloader.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: { mode: Scale.FIT, autoCenter: Scale.CENTER_BOTH },
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

  scene: [Preloader, Level001],
};

export default new Phaser.Game(config);
