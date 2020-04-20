const COLOR_PRIMARY = 0x959EB1;

export default class SpaceStation extends RexPlugins.Board.Shape {
  constructor(board, tileXY) {
    var scene = board.scene;
    if(tileXY == undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    super(board, tileXY.x, tileXY.y, 0, COLOR_PRIMARY);
    scene.add.existing(this);
    scene.add.sprite(this.x,this.y,'spacestation').setDepth(1).setScale(2);
  }
}