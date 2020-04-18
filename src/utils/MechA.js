import MoveableMarker from './MoveableMarker.js';

export default class MechA extends RexPlugins.Board.Shape {
  constructor(board, tileXY) {
      var scene = board.scene;
      if (tileXY === undefined) {
          tileXY = board.getRandomEmptyTileXY(0);
      }
      // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
      super(board, tileXY.x, tileXY.y, 0, COLOR_LIGHT);
      scene.add.existing(this);
      this.setDepth(1);

      // add behaviors
      this.moveTo = scene.rexBoard.add.moveTo(this, {speed: 200});
      this.pathFinder = scene.rexBoard.add.pathFinder(this, {
          cacheCost: false,
          costCallback: function (curTile, preTile, pathFinder) {
              var board = pathFinder.board;
              if (board.contains(curTile.x, curTile.y, 0)) {
                  return pathFinder.BLOCKER;
              }
              var cost = 1;
              var prePreTile = preTile.preNodes[0];
              if (prePreTile) {
                  var dirPreTileToCurTile = board.getNeighborTileDirection(preTile, curTile);
                  var dirPrePreTileToPreTile = board.getNeighborTileDirection(prePreTile, preTile);
                  if (dirPreTileToCurTile !== dirPrePreTileToPreTile) {
                      cost += 1;
                  }
              }
              return cost;
          }
      });

      // private members
      this._movingPoints = 5;
      this._markers = [];
  }

  showMoveableArea() {
      this.hideMoveableArea();
      var tileXYArray = this.pathFinder.findArea(this._movingPoints);
      for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
          this._markers.push(
              new MoveableMarker(this, tileXYArray[i])
          );
      }
      return this;
  }

  hideMoveableArea() {
      for (var i = 0, cnt = this._markers.length; i < cnt; i++) {
          this._markers[i].destroy();
      }
      this._markers.length = 0;
      return this;
  }

  moveToTile(endTile) {
      if (this.moveTo.isRunning) {
          return false;
      }
      var tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ);
      this.moveAlongPath(tileXYArray);
      return true;
  }

  moveAlongPath(path) {
      if (path.length === 0) {
          this.showMoveableArea();
          return;
      }

      this.moveTo.once('complete', function () {
          this.moveAlongPath(path);
      }, this);
      this.moveTo.moveTo(path.shift(),{
        speed: 1,
        rotateToTarget: true,
        occupiedTest: false,
        blockerTest: false,
        sneak: false,
      });
      return this;
  }
}

const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

const COLOR2_PRIMARY = 0xd81b60;
const COLOR2_LIGHT = 0xff5c8d;
const COLOR2_DARK = 0xa00037;