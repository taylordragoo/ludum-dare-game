const Random = Phaser.Math.Between;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({
      key: 'MainMenu'
    });
  }

  preload(){
    
  }

  create() {
    var music = this.sound.add('MainTheme');
    var musicVolume = 0.3;
    music.setVolume(musicVolume);
    music.play();
    this.registry.set('MusicVolume', musicVolume);

    var scrollMode = 0; // 0:vertical, 1:horizontal
    var gridTable = this.rexUI.add.gridTable({
        x: 800,
        y: 450,
        anchor: 'centerX',
        width: (scrollMode === 0) ? 300 : 420,
        height: (scrollMode === 0) ? 300 : 300,

        scrollMode: scrollMode,

        background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

        table: {
          cellWidth: (scrollMode === 0) ? undefined : 60,
          cellHeight: (scrollMode === 0) ? 60 : undefined,

          columns: 1,

          mask: {
              padding: 2,
          },

          reuseCellContainer: true,
      },
      space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,

          table: 10,
          header: 10,
          footer: 10,
      },
      expand: {
          header: true,
          footer: true,
      },

      align: {
          header: Phaser.Display.Align.CENTER,
          footer: 'center',
      },

      createCellContainerCallback: function (cell, cellContainer) {
          var scene = cell.scene,
              width = cell.width,
              height = cell.height,
              item = cell.item,
              index = cell.index;
          if (cellContainer === null) {
              cellContainer = scene.rexUI.add.label({
                  width: width,
                  height: height,

                  orientation: scrollMode,
                  background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                  icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                  text: scene.add.text(0, 0, ''),

                  space: {
                      icon: 10,
                      left: (scrollMode === 0) ? 15 : 0,
                      top: (scrollMode === 0) ? 0 : 15,
                  }
              });
            //   console.log(cell.index + ': create new cell-container');
          } else {
            //   console.log(cell.index + ': reuse cell-container');
          }

          // Set properties from item value
          cellContainer.setMinSize(width, height); // Size might changed in this demo
          cellContainer.getElement('text').setText(item); // Set text of text object
          cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
          return cellContainer;
      },
      items: getItems(5)
  }).layout()

  this.print = this.add.text(0, 0, '');
  gridTable
      .on('cell.over', function (cellContainer, cellIndex) {
          cellContainer.getElement('background')
              .setStrokeStyle(2, COLOR_LIGHT)
              .setDepth(1);
      }, this)
      .on('cell.out', function (cellContainer, cellIndex) {
          cellContainer.getElement('background')
              .setStrokeStyle(2, COLOR_DARK)
              .setDepth(0);
      }, this)
      .on('cell.click', function (cellContainer, cellIndex) {
        if(cellContainer.text == "New Game"){
          this.print.text += 'click ' + cellIndex + ': ' + cellContainer.text + '\n';
          this.scene.start('Level');
        //   this.scene.launch('HUD');
        } else if(cellContainer.text == "Options") {
          console.log("Options");
        } else if(cellContainer.text == "Credits") {
            // Code
            console.log("Credits");
        } else if(cellContainer.text == "Exit"){
            // Code
            music.stop();
            this.scene.start("Preload");
        } else {
            // Code
        }
      }, this)

    this.cameras.main.setBackgroundColor('#000014');
  }
}

var getItems = function (count) {
  var data = ['New Game','Options','Credits','Exit'];
  var startIdx = Random(0, 100);
  return data;
}

