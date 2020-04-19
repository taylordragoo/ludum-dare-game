import 'phaser';
import Board from '../utils/Board.js';
import PlayerShip from "../utils/PlayerShip.js";
import HUD from '../scenes/Hud.js';
import OpenDockMenu from '../utils/OpenDockMenu.js';
import StateMachine from '../states/StateMachine.js';
import IdleState from '../states/PlayerStates/IdleState.js';
import StartState from '../states/PlayerStates/StartState.js';
import MoveState from '../states/PlayerStates/MoveState.js';

var dockConfDiag = undefined;
var dockMenuDaig = undefined;

const getQuadGrid = (scene) => {
  var grid = scene.rexBoard.add.quadGrid({
    x: window.innerWidth,
    y: window.innerHeight,
    cellWidth: 100,
    cellHeight: 50,
    type: 'isometric'
  });
  return grid;
}

const OpenDockConfirmMenu = (scene) => {
  if(dockConfDiag === undefined){
    scene.playerShip.moveTo.enable = false;
    dockConfDiag = CreateDockConfirmMenu(scene)
  }
}

const CreateDockConfirmMenu = (scene) => {
  dockConfDiag = scene.rexUI.add.dialog({
    x: scene.playerShip.x,
    y: scene.playerShip.y,

    backgound: scene.rexUI.add.roundRectangle(0,0,100,1000,20,0xf57f17),
    title: scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(0,0,100,40,20,0xbc5100),
      text: scene.add.text(0,0, 'Docking Confirmation Requested?', {
        fontSize: '24px'
      }),
      space: {
        left: 15,
        right: 15,
        top: 10,
        bottom: 10
      }
    }),

    actions: [
      CreateLabel(scene, 'Yes'),
      CreateLabel(scene, 'No')
    ],

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
  .popUp(500)
  .setDepth(1);

  dockConfDiag.on('button.click', function(button, groupName, index){
    console.log(index)
    if(index === 0){
      dockConfDiag.scaleDownDestroy(100);
      dockConfDiag = undefined
      DockingRequestAccepted(scene);

    } else if(index === 1){
      dockConfDiag.scaleDownDestroy(100);
      dockConfDiag = undefined;
      DeclineToDock(scene);

    } else {
      dockConfDiag.scaleDownDestroy(100);
      dockConfDiag = undefined;
      scene.playerShip.moveTo.enable = true;
    }
  })
  // .on('button.over', function(button, groupName, index){
  //   button.setStrokeStyle(2,0xffffff);
  // })
  // .on('button.out', function(button, groupName, index){
  //   button.setStrokeStyle();
  // })

  return dockConfDiag;
}

const DeclineToDock = (scene) => {
  scene.playerShip.moveTo.enable = true;
  scene.isDocked = false;
}

const DockingRequestAccepted = (scene) => {
  scene.playerShip.moveTo.enable = false;
  scene.isDocked = true;
  OpenDockMenu(scene, scene.playerShip);
}

const CreateLabel = (scene, text) => {
  var _createLabel = scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0,0,0,0,20, 0xbc5100),
    text: scene.add.text(0,0,text, {
      fontSize: '24px'
    }),
    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  });
  return _createLabel;
}

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'Level' });
  }
  create() {
    var isDocked = false;
    const dialog = undefined;
    this.spaceDate = 0;
    this.spaceYear = 79;
    this.playerMoney = 10000

    // create board
    var config = {
      grid: getQuadGrid(this),
      width: 32,
      height: 32
    }

    // basic setup
    this.board = new Board(this, config);

    this.playerShip = new PlayerShip(this.board,{
      x: Phaser.Math.Between(4,20),
      y: Phaser.Math.Between(4,20),
      face: 0,
      cone: 2,

      costCallback: function(tileXY, fov){
        var board = fov.board;
        return (board.tileXYToChess(tileXY.x, tileXY.y, 0)) ? fov.BLOCKER : 0;
      },
    });

    this.playerHUD = new HUD();

    for (var i = 0; i < 16; i++) {
        this.board.addSpaceStation();
    }

    this.playerShip.showMoveableArea();

    this.cameras.main.startFollow(this.playerShip);
    
    this.playerMask = this.add.sprite(this.playerShip.x,this.playerShip.y,'mechRD').setDepth(1).setScale(.5);

    this.stateMachine = new StateMachine('start',{
      start: new StartState(),
      idle: new IdleState(),
      move: new MoveState(),
    }, [this, this.playerShip]);

    this.registry.set('energy', this.playerShip.energy);
    this.registry.set('spaceDate', this.spaceDate);
    this.registry.set('spaceYear', this.spaceYear);
    this.registry.set('money', this.playerMoney);
  }

  update(time, delta){

    // handle state machine 
    this.stateMachine.step();
    this.state = this.stateMachine.GetState();
    
    const scene = this;
    
    // update ship coordinates to the sprite can update accordingly
    this.playerMask.x = this.playerShip.x;
    this.playerMask.y = this.playerShip.y;

    if(this.state === "move") {
      if(this.playerShip.rexChess.tileXYZ.x < this.lastXVal) {
        this.playerMask.setTexture('mechLU').setDepth(1).setScale(.5);
        this.playerShip.energy -= 1;
        this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
        this.lastYVal = this.playerShip.rexChess.tileXYZ.y;
      } else if (this.playerShip.rexChess.tileXYZ.x > this.lastXVal){
        this.playerMask.setTexture('mechRD').setDepth(1).setScale(.5);
        this.playerShip.energy -= 1;
        this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
        this.lastYVal = this.playerShip.rexChess.tileXYZ.y;
      } else if (this.playerShip.rexChess.tileXYZ.y < this.lastYVal){
        this.playerShip.energy -= 1;
        this.playerMask.setTexture('mechRU').setDepth(1).setScale(.5);
        this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
        this.lastYVal = this.playerShip.rexChess.tileXYZ.y;
      } else if (this.playerShip.rexChess.tileXYZ.y > this.lastYVal){
        this.playerShip.energy -= 1;
        this.playerMask.setTexture('mechLD').setDepth(1).setScale(.5);
        this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
        this.lastYVal = this.playerShip.rexChess.tileXYZ.y;
      }

    } else if(this.state === "idle") {
      this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
      this.lastYVal = this.playerShip.rexChess.tileXYZ.y;

      this.registry.set('energy', this.playerShip.energy);
      this.neighborCheck = this.board.getNeighborChess(this.playerShip, null);
      
      // Is Next to a space station to dock
      if(this.neighborCheck != ""){ 
        OpenDockConfirmMenu(scene);
      } else {
        dockConfDiag = undefined;
      }

    } else if (this.state.start){
      this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
      this.lastYVal = this.playerShip.rexChess.tileXYZ.y;
    }
  }
}