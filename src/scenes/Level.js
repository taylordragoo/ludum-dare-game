import 'phaser';
import Blocker from '../utils/Blocker.js';
import SpaceStation from '../utils/SpaceStation.js';
import Board from '../utils/Board.js';
import MechA from '../utils/MechA.js';
import StateMachine from '../states/StateMachine.js';
import State from '../states/State.js';
import IdleState from '../states/PlayerStates/IdleState.js';
import MoveState from '../states/PlayerStates/MoveState.js';

export default class Level extends Phaser.Scene {

  constructor() {
    super({ key: 'Level' });
  }
  create() {
    var lvl_bg = this.add.image(-1600,-1600, 'galaxy_bg').setOrigin(0).setScale(.8).setDepth(0).setScrollFactor(.1);
    // this.date = this.add.bitmapText(10,10, 'minecraft', `Date: 1/14/2081`, 48).setScrollFactor(0).setDepth(3);

    // create board
    var config = {
      grid: getQuadGrid(this),
      width: 60,
      height: 60
    }

    // basic setup
    this.board = new Board(this, config);
    this.mechA = new MechA(this.board,{
      x: 4,
      y: 4,
      face: 0,
      cone: 2,

      costCallback: function(tileXY, fov){
        var board = fov.board;
        return (board.tileXYToChess(tileXY.x, tileXY.y, 0)) ? fov.BLOCKER : 0;
      },
      debug: {
        graphics: this.add.graphics().setDepth(10)
      }
    });
    for (var i = 0; i < 30; i++) {
        new SpaceStation(this.board);
    }
    this.mechA.showMoveableArea();

    // this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    this.cameras.main.startFollow(this.mechA);
    
    this.playerMask = this.add.sprite(this.mechA.x,this.mechA.y,'mechRD').setDepth(1).setScale(.5);
    var lastXVal;
    var lastYVal;

    this.stateMachine = new StateMachine('idle',{
      idle: new IdleState(),
      move: new MoveState(),
    }, [this, this.mechA]);

    var dialog = undefined;
    var buttons = this.rexUI.add.buttons({
      anchor: {
        left: 'left+10',
        centerY: 'center'
      },
      orientation: 'y',
      buttons: [
        createButton(this, 'Attack'),
        createButton(this, 'Move'),
        createButton(this, 'Overwatch'),
        createButton(this, 'Rest'),
      ],
    })
    .layout().setScrollFactor(0);
    buttons.on('button.click', function (button, index, pointer, event) {
      console.log(`Click button-${button.text}`);
      var x = pointer.x,
          y = pointer.y;

      if (dialog === undefined) {
          dialog = createDialog(this, 400, 400, function (color) {
              this.add.circle(x, y, 20, color);
              dialog.scaleDownDestroy(100);
              dialog = undefined;
          });
      } else if (!dialog.isInTouching(pointer)) {
          dialog.scaleDownDestroy(100);
          dialog = undefined;
      }
    },this);
    
  }

  update(time, delta){

    this.stateMachine.step();    
    this.playerMask.x = this.mechA.x;
    this.playerMask.y = this.mechA.y;

    if(this.mechA.moveTo.isRunning) {
      if(this.mechA.rexChess.tileXYZ.x < this.lastXVal) {
        this.playerMask.setTexture('mechLU').setDepth(1).setScale(.5);
        this.lastXVal = this.mechA.rexChess.tileXYZ.x;
        this.lastYVal = this.mechA.rexChess.tileXYZ.y;
      } else if (this.mechA.rexChess.tileXYZ.x > this.lastXVal){
        this.playerMask.setTexture('mechRD').setDepth(1).setScale(.5);
        this.lastXVal = this.mechA.rexChess.tileXYZ.x;
        this.lastYVal = this.mechA.rexChess.tileXYZ.y;
      } else if (this.mechA.rexChess.tileXYZ.y < this.lastYVal){
        this.playerMask.setTexture('mechRU').setDepth(1).setScale(.5);
        this.lastXVal = this.mechA.rexChess.tileXYZ.x;
        this.lastYVal = this.mechA.rexChess.tileXYZ.y;
      } else if (this.mechA.rexChess.tileXYZ.y > this.lastYVal){
        this.playerMask.setTexture('mechLD').setDepth(1).setScale(.5);
        this.lastXVal = this.mechA.rexChess.tileXYZ.x;
        this.lastYVal = this.mechA.rexChess.tileXYZ.y;
      }
    } else {
      this.lastXVal = this.mechA.rexChess.tileXYZ.x;
      this.lastYVal = this.mechA.rexChess.tileXYZ.y;
    }
  }
}

var getQuadGrid = function (scene) {
  var grid = scene.rexBoard.add.quadGrid({
    x: window.innerWidth / 2,
    y: window.innerHeight / 6,
    cellWidth: 100,
    cellHeight: 50,
    type: 'isometric'
  });
  return grid;
}

var createButton = function (scene, text) {
  return scene.rexUI.add.label({
      width: 100,
      height: 40,
      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
      text: scene.add.text(0, 0, text, {
          fontSize: 18
      }),
      space: {
          left: 10,
          right: 10,
      }
  });
}

var createDialog = function (scene, x, y, onClick) {
  var dialog = scene.rexUI.add.dialog({
    x: x,
    y: y,

    background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),
    title: scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
      text: scene.add.text(0, 0, 'Pick a color', {
        fontSize: '20px'
      }),
      space: {
        left: 15,
        right: 15,
        top: 10,
        bottom: 10
      }
    }),
    actionsAlign: 'left',
    space: {
      title: 10,
      action: 5,

      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    }
  })
  .layout()
  .pushIntoBounds()
  .popUp(500)
  .setScrollFactor(0);

  dialog
    .on('button.click', function (button, groupName, index) {
        onClick(button.fillColor);
        dialog.scaleDownDestroy(100);
    })
    .on('button.over', function (button, groupName, index) {
        button.setStrokeStyle(2, 0xffffff);
    })
    .on('button.out', function (button, groupName, index) {
        button.setStrokeStyle();
    });

  return dialog;
}

const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

const COLOR2_PRIMARY = 0xd81b60;
const COLOR2_LIGHT = 0xff5c8d;
const COLOR2_DARK = 0xa00037;
