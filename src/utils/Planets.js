export default class Planets extends RexPlugins.Board.Shape {
    constructor(board, tileXY) {
      var scene = board.scene;
      if(tileXY == undefined) {
        tileXY = board.getRandomEmptyTileXY(0);
      }
      super(board, tileXY.x, tileXY.y, 0, COLOR_DARK);
      scene.add.existing(this);
    }
  }
  
  const COLOR_PRIMARY = 0x039BCF;
  const COLOR_LIGHT = 0xACDEF0;
  const COLOR_DARK = 0x465B62;
  
  const COLOR2_PRIMARY = 0xd81b60;
  const COLOR2_LIGHT = 0xff5c8d;
  const COLOR2_DARK = 0xa00037;