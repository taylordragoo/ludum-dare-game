import 'phaser';
import rexPathFollower from '../plugins/pathfollower-plugin.js';

const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

export default class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'Demo'
        })
        this.clock;
        this.text;
    }

    preload() {}

    create() {
        var path = this.add.path(100, 100)
            .lineTo(300, 100)
            .lineTo(100, 300)
            .lineTo(300, 300)
            .lineTo(100, 100);
        var graphics = this.add.graphics({
            lineStyle: {
                width: 3,
                color: COLOR_DARK,
                alpha: 1
            }
        })
        path.draw(graphics);

        var gameObject = this.add.rectangle(0, 0, 30, 30, COLOR_PRIMARY);
        gameObject.pathFollower = this.plugins.get('rexPathFollower').add(gameObject, {
            path: path,
            t: 0,
            rotateToPath: true
        });

        this.tweens.add({
            targets: gameObject.pathFollower,
            t: 1,
            ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 3000,
            repeat: -1,
            yoyo: false
        });

    }

    update() {}
}