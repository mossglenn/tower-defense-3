import Tower from './Tower.ts';
import * as TowerList from './TowerRanks.ts';

export default class TowerManager {
  towerlist = TowerList;

  towers: Tower[] = [];

  // map[row][col]
  towerMap: number[][] = [];

  // loadTowers(towerKeys: string[]){
  //   towerKeys.forEach(key => makeTower())
  // };
}
