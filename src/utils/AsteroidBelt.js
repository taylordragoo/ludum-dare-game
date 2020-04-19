const COLOR_PRIMARY = 0x4D2802;

export default class AsteroidBelt extends RexPlugins.Board.Shape {
    constructor(board, tileXY) {
        var scene = board.scene;
        if(tileXY == undefined) {
            tileXY = board.getRandomEmptyTileXY(0);
        }
        super(board, tileXY.x, tileXY.y, 0, COLOR_PRIMARY).setDepth(0);
        scene.add.existing(this).setDepth(0);
    }
}
  