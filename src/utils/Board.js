import SpaceStation from './SpaceStation.js'

export default class Board extends RexPlugins.Board.Board {
    constructor(scene, config) {
        // create board
        super(scene, config);
        // draw grid
        var graphics = scene.add.graphics({
          lineStyle: {
              width: 1,
              color: COLOR_PRIMARY,
              alpha: 0.3,  
          },
        });
        this.forEachTileXY(function (tileXY, board) {
            var points = board.getGridPoints(tileXY.x, tileXY.y, true);
            graphics.strokePoints(points, true);
        });
        // enable touch events
        this.setInteractive();
    }

    addSpaceStation(tileXY){
        if(tileXY === undefined){
            tileXY = this.getRandomEmptyTileXY(1);
        }
        new SpaceStation(this, tileXY);
        return this;
    }
}

const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

const COLOR2_PRIMARY = 0xd81b60;
const COLOR2_LIGHT = 0xff5c8d;
const COLOR2_DARK = 0xa00037;