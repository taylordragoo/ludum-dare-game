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

export default function OpenDockMenu(scene, playerShip) {
    var DockedMenu = scene.rexUI.add.dialog({
        x: scene.playerShip.x, 
        y: scene.playerShip.y,
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
    }).setDepth(1).layout();  

    scene.print = scene.add.text(0, 0, '');
    DockedMenu.on('button.click', function (button, groupName, index) {
        console.log(index + ': ' + button.text + '\n');
        if(index === 3){
            DockedMenu.scaleDownDestroy(100);
            scene.playerShip.moveTo.enable = true;
        }
    }, scene)
    .on('button.over', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle();
    });
}

