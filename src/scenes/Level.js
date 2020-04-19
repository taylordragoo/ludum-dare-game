import 'phaser';
import Board from '../utils/Board.js';
import PlayerShip from "../utils/PlayerShip.js";
import OpenDockMenu from '../utils/OpenDockMenu.js';
import OpenMiningMenu from '../utils/OpenMiningMenu.js';
import StateMachine from '../states/StateMachine.js';
import IdleState from '../states/PlayerStates/IdleState.js';
import StartState from '../states/PlayerStates/StartState.js';
import MoveState from '../states/PlayerStates/MoveState.js';
import Events from '../utils/events.json';

var dockConfDiag = undefined;
var mineConfDiag = undefined;
var isDocked = false;
var isMining = false;
var isRandomEvent = false;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

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

const GetValue = Phaser.Utils.Objects.GetValue;

const createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

const getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
            fontSize: '20px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 3
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

const getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}
const OpenDockConfirmMenu = (scene) => {
  if(dockConfDiag === undefined && !scene.isDocked){
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

  dockConfDiag
  .on('button.click', function(button, groupName, index){
    console.log(index)
    if(index === 0){
      dockConfDiag.scaleDownDestroy(100);
      DockingRequestAccepted(scene);

    } else if(index === 1){
      dockConfDiag.scaleDownDestroy(100);
      DeclineToDock(scene);

    } else {
      dockConfDiag.scaleDownDestroy(100);
      dockConfDiag = undefined;
      scene.playerShip.moveTo.enable = true;
    }
  })

  return dockConfDiag;
}

const OpenMiningConfirmMenu = (scene) => {
  if(mineConfDiag === undefined && !scene.isMining){
    scene.playerShip.moveTo.enable = false;
    mineConfDiag = CreateMiningConfirmMenu(scene)
  }
}

const CreateMiningConfirmMenu = (scene) => {
  mineConfDiag = scene.rexUI.add.dialog({
    x: scene.playerShip.x,
    y: scene.playerShip.y,

    backgound: scene.rexUI.add.roundRectangle(0,0,100,1000,20,0xf57f17),
    title: scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(0,0,100,40,20,0xbc5100),
      text: scene.add.text(0,0, 'Engage Mining Turrets?', {
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

  mineConfDiag
  .on('button.click', function(button, groupName, index){
    console.log(index)
    if(index === 0){
      mineConfDiag.scaleDownDestroy(100);
      MiningRequestAccepted(scene);

    } else if(index === 1){
      mineConfDiag.scaleDownDestroy(100);
      DeclineToMine(scene);

    } else {
      mineConfDiag.scaleDownDestroy(100);
      mineConfDiag = undefined;
      scene.playerShip.moveTo.enable = true;
    }
  })

  return mineConfDiag;
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

const DeclineToMine = (scene) => {
  scene.playerShip.moveTo.enable = true;
  scene.isDocked = false;
}

const MiningRequestAccepted = (scene) => {
  scene.playerShip.moveTo.enable = false;
  scene.isMining = true;
  OpenMiningMenu(scene, scene.playerShip);
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

const RandomEventMenu = (scene) => {

}

const GetRandomEvent = (scene) => {
  isRandomEvent = true;
	let type;
  const variety = Phaser.Math.Between(1,10);
  
	if(variety === 1 || variety === 2) {
		type = "negative";
	} else if (variety >= 3 && variety <= 8) {
		type = "neutral";
	} else {
		type = "good";
  };

  var event = Phaser.Utils.Array.GetRandom(scene.data[type]);
  console.log(event);
  if(type === "good"){
    scene.playerShip.energy += parseInt(event.energy);
    scene.playerShip.money += parseInt(event.money);
    scene.playerShip.minerals += parseInt(event.minerals);
    scene.playerShip.status = event.title;
  } else if(type === "bad"){
    scene.playerShip.energy -= parseInt(event.energy);
    scene.playerShip.money -= parseInt(event.money);
    scene.playerShip.minerals -= parseInt(event.minerals);
    scene.playerShip.status = event.title;
  } else {
    scene.playerShip.energy += parseInt(event.energy);
    scene.playerShip.money += parseInt(event.money);
    scene.playerShip.minerals += parseInt(event.minerals);
    scene.playerShip.status = event.title;
  }

  scene.registry.set('energy', scene.playerShip.energy);
  scene.registry.set('money', scene.playerShip.money);
  scene.registry.set('minerals', scene.playerShip.minerals);
  scene.registry.set('status', scene.playerShip.status);
}

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'Level' });
  }
  preload(){
    this.load.json('eventData', Events);
  }
  create() {
    this.playerStartLocation = undefined;
    this.playerStartLocationX = undefined;
    this.playerStartLocationY = undefined;

    this.data = this.cache.json.get('eventData');

    this.style = { font: "40px", fill: "#ffffff", align: "center" };
    this.energyText = this.add.text(10, 1, `Energy Core: ${this.registry.get('energy')}`, this.style).setScrollFactor(0).setDepth(99);
    this.moneyText = this.add.text(10, 45, `Money: ${this.registry.get('money')}`, this.style).setScrollFactor(0).setDepth(99);
    this.mineralsText = this.add.text(10,90, `Minerals: ${this.registry.get('minerals')}`, this.style).setScrollFactor(0).setDepth(99);
    this.statusTrackerText = this.add.text(10,135, `Status: ${this.registry.get('status')}`, this.style).setScrollFactor(0).setDepth(99);

    // create board
    var config = {
      grid: getQuadGrid(this),
      width: 32,
      height: 32
    }

    // basic setup
    this.board = new Board(this, config);

    this.allAsteroidBelts = [];
    this.allStations = [];
    
    for (var i = 0; i < 4; i++) {
        this.spaceStation = this.board.addSpaceStation();
        this.allStations.push(this.spaceStation);
    }

    for(var i = 0; i < 32; i++){
      this.asteroidBelt = this.board.addAsteroidBelt();
      this.allAsteroidBelts.push(this.asteroidBelt);
    }

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

    this.playerShip.showMoveableArea();

    this.cameras.main.startFollow(this.playerShip);
    
    this.playerMask = this.add.sprite(this.playerShip.x,this.playerShip.y,'mechRD').setDepth(1).setScale(.5);

    this.stateMachine = new StateMachine('start',{
      start: new StartState(),
      idle: new IdleState(),
      move: new MoveState(),
    }, [this, this.playerShip]);

    this.registry.set('energy', this.playerShip.energy);
    this.registry.set('money', this.playerShip.money);
    this.registry.set('minerals', this.playerShip.minerals);
    this.registry.set('status', this.playerShip.status);

    this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
    this.lastYVal = this.playerShip.rexChess.tileXYZ.y;
  }

  update(time, delta){
    // handle state machine 
    this.stateMachine.step();
    this.state = this.stateMachine.GetState();
    
    const scene = this;

    // UI Panel
    this.energyText.text = `Energy Core: ${this.registry.get('energy')}%`
    this.moneyText.text = `Money: $${this.registry.get('money')}`
    this.mineralsText.text = `Minerals: ${this.registry.get('minerals')}`
    this.statusTrackerText.text = `Status: ${this.registry.get('status')}`
    
    // update ship coordinates to the sprite can update accordingly
    this.playerMask.x = this.playerShip.x;
    this.playerMask.y = this.playerShip.y;

    if(this.state === "move") {
      isRandomEvent = false;
      // Update Animation
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

      // movement cost
      this.registry.set('energy', this.playerShip.energy);

      // Check for neighbors and random events
      this.neighborCheck = this.board.getNeighborChess(this.playerShip, null);

      // if nieghbor exists
      if(this.neighborCheck != ""){
        if(this.allStations.includes(this.neighborCheck[0])) {
          // Open Space Station
          OpenDockConfirmMenu(scene);

        } else if(this.allAsteroidBelts.includes(this.neighborCheck[0])) {
          // Open Mining Menu
          OpenMiningConfirmMenu(scene);
          
        }

      } else if(!isRandomEvent) {
        var eventVars = GetRandomEvent(scene);
        dockConfDiag = undefined;
        mineConfDiag = undefined;

      }
    } else if (this.state.start){
      this.lastXVal = this.playerShip.rexChess.tileXYZ.x;
      this.lastYVal = this.playerShip.rexChess.tileXYZ.y;

    }
  }
}