const COLOR_PRIMARY = 0x4e342e;
export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: 'HUD'
        });
    }
    create() {
        var scene = this;
        this.dialog = undefined;
        this.style = { font: "40px", fill: "#ffffff", align: "center" };
        this.energyText = this.add.text(10, 1, `Energy Core: ${this.registry.get('energy')}`, this.style).setScrollFactor(0).setDepth(3);
        this.moneyText = this.add.text(10, 45, `Money: ${this.registry.get('money')}`, this.style).setScrollFactor(0).setDepth(3);
    }

    update() {
        this.energyText.text = `Energy Core: ${this.registry.get('energy')}`
        this.moneyText.text = `Money: $${this.registry.get('money')}.00`
    }

    InitDockingSequence(scene){
        if(this.dialog == undefined) {
            this.dialog = createDialog(scene)
        }
    }
}

var createLabel = function(scene, text, backgroundColor) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0,0,100,40,20,0x6a4f4b),
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
}

var createDialog = function(scene) {
    var dialog = scene.rexUI.add.dialog({
        x: 800,
        y: 450,

        background: scene.rexUI.add.roundRectangle(0,0,100,100,20, 0x3e2723),
        title: scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0,0,100,40,20,0x1b0000),
            text: scene.add.text(0,0, 'Space Station Dock 1', {
                fontSize: '24px',
            }),
        }),
        content: scene.add.text(0,0,'Welcome to the Space Station', {
            fontSize: '24px',
        }),

        choices: [
            createLabel(scene, 'Sleep'),
            createLabel(scene, 'Trade'),
            createLabel(scene, 'Repair Ship'),
            createLabel(scene, 'Undock')
        ],

        space: {
            title: 25,
            content: 25,
            choice: 15,

            left: 25,
            right: 25,
            top: 25,
            bottom: 25,
        },

        expand: {
            content: false,
        }
    }).layout().popUp(1000).setDepth(999);
}

