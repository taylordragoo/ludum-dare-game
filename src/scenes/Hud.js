const COLOR_PRIMARY = 0x4e342e;
export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: 'HUD'
        });
    }
    create() {
        this.style = { font: "40px", fill: "#ffffff", align: "center" };
        this.energyText = this.add.text(10, 1, `Energy Core: ${this.registry.get('energy')}`, this.style).setScrollFactor(0).setDepth(3);
        this.moneyText = this.add.text(10, 45, `Money: ${this.registry.get('money')}`, this.style).setScrollFactor(0).setDepth(3);
    }

    update() {
        this.energyText.text = `Energy Core: ${this.registry.get('energy')}`
        this.moneyText.text = `Money: $${this.registry.get('money')}.00`
    }

}