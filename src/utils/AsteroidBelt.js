const COLOR_PRIMARY = 0x4D2802;

export default class AsteroidBelt extends RexPlugins.Board.Shape {
    constructor(board, tileXY) {
        var scene = board.scene;
        if(tileXY == undefined) {
            tileXY = board.getRandomEmptyTileXY(0);
        }
        super(board, tileXY.x, tileXY.y, 0, COLOR_PRIMARY).setDepth(0).setAlpha(0.3);
        scene.add.existing(this).setDepth(0);
        scene.add.sprite(this.x,this.y,'asteroidbelt').setDepth(1).setScale(1.5);
    }
}
  