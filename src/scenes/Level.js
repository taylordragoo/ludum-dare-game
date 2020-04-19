import 'phaser';
import SpaceStation from '../utils/SpaceStation.js';
import Planets from '../utils/Planets.js';
import Board from '../utils/Board.js';
import PlayerShip from "../utils/PlayerShip.js";
import HUD from '../scenes/Hud.js';
import StateMachine from '../states/StateMachine.js';
import IdleState from '../states/PlayerStates/IdleState.js';
import StartState from '../states/PlayerStates/StartState.js';
import MoveState from '../states/PlayerStates/MoveState.js';

export default class Level extends Phaser.Scene {

  constructor() {
    super({ key: 'Level' });
  }
  create() {
    // Game Background
    var lvl_bg = this.add.image(-1600,-1600, 'galaxy_bg').setOrigin(0).setScale(.8).setDepth(0).setScrollFactor(.1);

    // Game variables
    var scene = this;
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

      if(this.neighborCheck != ""){

      }
    } else if (this.state.start){
      this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
      this.lastYVal = this.playerShip.rexChess.tileXYZ.y;

      var startMenu = this.rexUI.add.dialog({
        x: 800,
        y: 450,

        background: this.rexUI.add.roundRectangle(0,0,)
      });
    }
  }
}

var getQuadGrid = function (scene) {
  var grid = scene.rexBoard.add.quadGrid({
    x: window.innerWidth,
    y: window.innerHeight,
    cellWidth: 100,
    cellHeight: 50,
    type: 'isometric'
  });
  return grid;
}

const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

const COLOR2_PRIMARY = 0xd81b60;
const COLOR2_LIGHT = 0xff5c8d;
const COLOR2_DARK = 0xa00037;
