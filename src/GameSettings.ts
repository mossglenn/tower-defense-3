import { Popgun, PotatoGun, Shotgun } from './objects/TowerRanks.ts';

const GameSettings = {
  game: { width: 1280, height: 768 }, // { width: 1280, height: 720 }, // { width: 768, height: 576 },
  sidebar: {
    sourceZones: [
      {
        name: 'PotatoGun',
        class: PotatoGun,
        origin: { x: 32 + 0, y: 32 + 64 * 4 },
      },
      {
        name: 'Shotgun',
        class: Shotgun,
        origin: { x: 32 + 64, y: 32 + 64 * 4 },
      },
      { name: 'Popgun', class: Popgun, origin: { x: 32, y: 32 + 64 * 5 } },
    ],
  },
  enemy: { size: 64 },
};
export default GameSettings;
