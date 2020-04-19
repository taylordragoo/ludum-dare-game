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

export default function OpenMiningMenu(scene, playerShip) {
    var MiningMenu = scene.rexUI.add.dialog({
        x: scene.playerShip.x, 
        y: scene.playerShip.y,
        background: scene.rexUI.add.roundRectangle(0,0,100,100,20, 0x3e2723),
        title: scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0,0,100,40,20,0x1b0000),
            // text: scene.add.text(0,0, '', {
            //     fontSize: '24px',
            //     align: 'center'
            // }),
        }),
        content: scene.add.text(0,0,'Deep Core Mining Laser ', {
            fontSize: '24px',
            align: 'center'
        }),

        choices: [
            createLabel(scene, 'Continue Mining'),
            createLabel(scene, 'Disengage Turrets')
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
        },

        align: {
            title: 'center',
            content: 'center',
            choice: 'center',
            actions: 'center',
        },
    }).setDepth(1).layout();  

    scene.print = scene.add.text(0, 0, '');
    MiningMenu.on('button.click', function (button, groupName, index) {
        console.log(index + ': ' + button.text + '\n');
        if(index === 1){
            MiningMenu.scaleDownDestroy(100);
            scene.playerShip.moveTo.enable = true;
            scene.isMining = false;
        } else if (index === 0 && scene.playerShip.energy >= 0){
            scene.playerShip.energy -= 1;
            this.registry.set('energy', scene.playerShip.energy);
            
            scene.playerShip.minerals += 10;
            this.registry.set('minerals', scene.playerShip.minerals);
        }
    }, scene)
    .on('button.over', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle();
    });
}

