export default class Preload extends Phaser.Scene {
    constructor() {
        super({
            key: 'Preload'
        });
    }

    preload() {
        //create a background and prepare loading bar
        this.cameras.main.setBackgroundColor('#4d4738');
        this.fullBar = this.add.graphics();
        this.fullBar.fillStyle(0xda7a34, 1);
        this.fullBar.fillRect((this.cameras.main.width / 4) - 2, (this.cameras.main.height / 2) - 18, (this.cameras.main.width / 2) + 4, 20);
        this.progress = this.add.graphics();

        //pass loading progress as value to loading bar and redraw as files load
        this.load.on('progress', function(value) {
            this.progress.clear();
            this.progress.fillStyle(0xfff6d3, 1);
            this.progress.fillRect((this.cameras.main.width / 4), (this.cameras.main.height / 2) - 16, (this.cameras.main.width / 2) * value, 16);
        }, this);

        //cleanup our graphics on complete
        this.load.on('complete', function() {
            this.progress.destroy();
            this.fullBar.destroy();
        }, this);

        this.load.image('mechLD', 'src/assets/PlayerShip_LEFT.png');
        this.load.image('mechRD', 'src/assets/PlayerShip_RIGHT.png');
        this.load.image('mechLU', 'src/assets/PlayerShip_LEFT.png');
        this.load.image('mechRU', 'src/assets/PlayerShip_RIGHT.png');
        this.load.image('asteroidbelt', 'src/assets/asteroidbelt.png');
        this.load.image('spacestation', 'src/assets/spacestation.png');

        this.load.audio('MainTheme', 'src/assets/MainTheme.wav');
    }

    create() {


        this.anims.create({
            key: 'left-down',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('mechLD')
        });
        this.anims.create({
            key: 'left-up',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('mechLU')
        });
        this.anims.create({
            key: 'right-down',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('mechRD')
        });
        this.anims.create({
            key: 'right-up',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNames('mechRU')
        });
        
        this.scene.start('MainMenu');
    }
}
