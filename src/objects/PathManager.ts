import Phaser from 'phaser';
import { NamedPaths, PathsData, PathInfo } from './CustomTypes.ts';

export default class PathManager {
  paths?: NamedPaths;

  pathNames: string[] = [];

  pathsData?: PathsData;

  addData(pathsData: PathsData) {
    this.pathsData = pathsData;
    this.paths = PathManager.createPathsFromData(pathsData);
    this.updatePathNames();
  }

  private updatePathNames() {
    if (this.paths === undefined) {
      console.log('ERROR trying to update path name of undefined paths');
    } else {
      const keys = Object.keys(this.paths!);
      keys.forEach((key) => this.pathNames.push(key));
    }
  }

  static createPathsFromData(data: PathsData): NamedPaths {
    const namedPaths: NamedPaths = {};
    data.forEach((pathInfo) => {
      namedPaths[pathInfo.name] = PathManager.createPath(pathInfo);
    });
    return namedPaths;
  }

  static createPath(pathInfo: PathInfo): Phaser.Curves.Path {
    const { name, points } = pathInfo;
    const pathEnd = points.pop();

    if (pathEnd !== undefined) {
      pathEnd.x = pathEnd.x === 768 ? 768 + 32 : pathEnd.x;
      pathEnd.y = pathEnd.y === 576 ? 576 + 32 : pathEnd.y;
      points.push(pathEnd);
      const pathStart = points.shift();

      if (pathStart !== undefined) {
        const startingX = pathStart.x === 0 ? -32 : pathStart!.x;
        const startingY = pathStart.y === 0 ? -32 : pathStart!.y;
        const newPath = new Phaser.Curves.Path(startingX, startingY);

        points.forEach((value) => {
          newPath.lineTo(value.x, value.y);
        });
        newPath.name = name;
        return newPath;
      }
    }
    console.log('Error creating new path');
    return new Phaser.Curves.Path();
  }
}
