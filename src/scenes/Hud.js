export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: 'HUD'
        });
    }
    create() {
        // this.money = this.add.bitmapText(10, 1, 'minecraft', `Money: $${this.registry.get('money_current')}`, 24).setScrollFactor(0).setDepth(3);
        // this.date = this.add.bitmapText(10,20, 'minecraft', `Date: 1/14/2081`, 24).setScrollFactor(0).setDepth(3);
    }
}
