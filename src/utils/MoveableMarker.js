export default class MoveableMarker extends RexPlugins.Board.Shape {
  constructor(chess, tileXY) {
    var board = chess.rexChess.board;
    var scene = board.scene;
    super(board, tileXY.x, tileXY.y, -1, COLOR2_DARK);
    scene.add.existing(this);
    this.setScale(0.5);

    this.on('board.pointerdown', function(){
      if(!chess.moveToTile(this)){
        return;
      }
      this.setFillStyle(COLOR2_LIGHT);
    }, this);
  }
}

const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

const COLOR2_PRIMARY = 0xd81b60;
const COLOR2_LIGHT = 0xff5c8d;
const COLOR2_DARK = 0xa00037;