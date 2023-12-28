import Phaser from 'phaser';
import { PathsData, PathInfo } from './CustomTypes.ts';
import GameSettings from '../GameSettings.ts';

export default class PathManager {
  paths: Phaser.Curves.Path[] = [];

  pathNames: string[] = [];

  pathsData?: PathsData;

  addPathsFromData(pathsData: PathsData) {
    this.pathsData = pathsData;
    this.paths = PathManager.createPathsFromData(pathsData);
    this.updatePathNames();
  }

  addPathsFromMapLayers(
    pathAdjustment: number,
    layers: Phaser.Tilemaps.ObjectLayer[]
  ) {
    const pathsData: PathInfo[] = layers.map(
      (layer): PathInfo => PathManager.pathInfofromLayer(pathAdjustment, layer)
    );
    this.addPathsFromData(pathsData);
  }

  addNamedPath(pathInfo: PathInfo) {
    this.paths.push(PathManager.createPath(pathInfo));
  }

  getPath(name: string): Phaser.Curves.Path | undefined {
    return this.paths.find((path) => path.name === name);
  }

  private updatePathNames() {
    if (this.paths === undefined) {
      console.log('ERROR trying to update path name of undefined paths');
    } else {
      this.pathNames = this.paths.map((path) => path.name);
    }
  }

  static createPathsFromData(data: PathsData): Phaser.Curves.Path[] {
    const namedPaths: Phaser.Curves.Path[] = [];
    data.forEach((pathInfo) => {
      namedPaths.push(PathManager.createPath(pathInfo));
    });
    return namedPaths;
  }

  static createPath(pathInfo: PathInfo): Phaser.Curves.Path {
    const { name, points } = pathInfo;
    const pathStart = points.shift();
    if (pathStart === undefined) {
      console.log('starting point in path is undefined');
      return new Phaser.Curves.Path();
    }
    const startingX = pathStart.x === 0 ? -32 : pathStart!.x;
    const startingY = pathStart.y === 0 ? -32 : pathStart!.y;
    const newPath = new Phaser.Curves.Path(startingX, startingY);
    points.forEach((point) => {
      let nextPointX: number = -2000;
      switch (point.x) {
        case 0:
          nextPointX = 0 - GameSettings.enemy.size / 2;
          break;
        case GameSettings.game.width:
          nextPointX = GameSettings.game.width + GameSettings.enemy.size / 2;
          break;
        default:
          nextPointX = point.x;
          break;
      }
      let nextPointY: number = -2000;
      switch (point.y) {
        case 0:
          nextPointY = 0 - GameSettings.enemy.size / 2;
          break;
        case GameSettings.game.height:
          nextPointY = GameSettings.game.height + GameSettings.enemy.size / 2;
          break;
        default:
          nextPointY = point.y;
          break;
      }
      newPath.lineTo(nextPointX, nextPointY);
    });
    newPath.name = name;
    return newPath;
  }

  static pathInfofromLayer(
    pathAdjustment: number,
    pathLayer: Phaser.Tilemaps.ObjectLayer
  ): PathInfo {
    const { name } = pathLayer;
    const points: Phaser.Math.Vector2[] = pathLayer.objects.map(
      (obj): Phaser.Math.Vector2 =>
        new Phaser.Math.Vector2(obj.x + pathAdjustment, obj.y - pathAdjustment)
    );
    points[0] = PathManager.movePointToClosestEdge(
      points[0],
      GameSettings.game
    );
    let lastPoint = points.pop();
    if (lastPoint === undefined) {
      console.log('last point in layer is undefined');
    } else {
      lastPoint = PathManager.movePointToClosestEdge(
        lastPoint,
        GameSettings.game
      );
      points.push(lastPoint);
    }
    return { name, points };
  }

  static getDistancesFromEdges(
    point: Phaser.Math.Vector2,
    gameSettings: { width: number; height: number }
  ): { side: string; distance: number }[] {
    return [
      { side: 'top', distance: point.y },
      {
        side: 'right',
        distance: gameSettings.width - point.x,
      },
      {
        side: 'bottom',
        distance: gameSettings.height - point.y,
      },
      { side: 'left', distance: point.x },
    ].sort((a, b) => a.distance - b.distance);
  }

  static movePointToClosestEdge(
    point: Phaser.Math.Vector2,
    gameSettings: { width: number; height: number }
  ): Phaser.Math.Vector2 {
    const distances = PathManager.getDistancesFromEdges(point, gameSettings);
    switch (distances[0].side) {
      case 'top':
        return new Phaser.Math.Vector2(point.x, 0);
      case 'right':
        return new Phaser.Math.Vector2(GameSettings.game.width, point.y);
      case 'bottom':
        return new Phaser.Math.Vector2(point.x, GameSettings.game.height);

      default:
        return new Phaser.Math.Vector2(0, point.y);
    }
  }
}
