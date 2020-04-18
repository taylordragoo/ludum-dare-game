export default class HomeBase extends Phaser.Scene {
    constructor() {
        super({
            key: 'HomeBase'
        });
    }
  
    create() {
      this.cameras.main.setBackgroundColor(0x2a0503);
      var lvl_bg = this.add.image(0,0, 'galaxy_map').setOrigin(0).setDepth(0).setScrollFactor(.1);
      // lvl_bg.width = this.game.config.width;
      // lvl_bg.height = this.game.config.height;
      this.text = this.add.bitmapText(this.cameras.main.width / 2, this.cameras.main.height / 2 + 128, 'minecraft', 'Build Galaxy Map Here');
      this.text.setOrigin(.5);
      this.input.keyboard.on('keydown_ENTER', function(event) {
        this.scene.launch('HUD');
        this.scene.start('Level');
      }, this);
  
      var dialog = undefined;
      var buttons = this.rexUI.add.buttons({
        anchor: {
          left: 'center',
          centerY: 'center'
        },
        orientation: 'y',
        buttons: [
          createButton(this, 'Space Colony'),
          createButton(this, 'Starbase 01'),
          createButton(this, 'Starbase 02'),
          createButton(this, 'Low Altitude Earth Orbit'),
          createButton(this, 'Earth Base'),
        ],
      })
      .layout()
      .drawBounds(this.add.graphics(), 0xff0000).setScrollFactor(0)
      buttons.on('button.click', function (button, index, pointer, event) {
        console.log(`Click button-${button.text}`);
        // var x = pointer.x,
        //     y = pointer.y;
  
        if (dialog === undefined) {
            dialog = createDialog(this, 1000, 1000, function (color) {
                this.add.circle(x, y, 20, color);
                // this.print.text = 'Add object at (' + x + ',' + y + ')';
                dialog.scaleDownDestroy(100);
                dialog = undefined;
            });
            // this.print.text = 'Click (' + x + ',' + y + ')';
        } else if (!dialog.isInTouching(pointer)) {
            dialog.scaleDownDestroy(100);
            dialog = undefined;
        }
      },this);
    }
  }
  
  var createButton = function (scene, text) {
    return scene.rexUI.add.label({
        width: 100,
        height: 40,
        background: scene.rexUI.add.roundRectangle(800, 800, 0, 0, 20, COLOR_LIGHT),
        text: scene.add.text(400, 400, text, {
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
        text: scene.add.text(0, 0, 'Star Base 0049', {
          fontSize: '20px'
        }),
        space: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      }),
      // actions: [
      //   scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
      //   scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
      //   scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
      //   scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
      //   scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
      //   scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
      // ],
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
  
  const COLOR_PRIMARY = 0x4e342e;
  const COLOR_LIGHT = 0x7b5e57;
  const COLOR_DARK = 0x260e04;
  const COLOR2_PRIMARY = 0xd81b60;
  const COLOR2_LIGHT = 0xff5c8d;
  const COLOR2_DARK = 0xa00037;
    