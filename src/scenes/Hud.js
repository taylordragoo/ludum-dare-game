const COLOR_PRIMARY = 0x43a047;
const COLOR_LIGHT = 0x76d275;
const COLOR_DARK = 0x00701a;

export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: 'HUD'
        });
    }
    create() {
        this.style = { font: "40px", fill: "#ffffff", align: "center" };
        this.energyText = this.add.text(10, 1, `Energy Core: ${this.registry.get('energy')}`, this.style).setScrollFactor(0).setDepth(99);
        this.moneyText = this.add.text(10, 45, `Money: ${this.registry.get('money')}`, this.style).setScrollFactor(0).setDepth(99);
        this.moraleText = this.add.text(10,90, `Minerals: ${this.registry.get('minerals')}`, this.style).setScrollFactor(0).setDepth(99);
    }

    update() {
        this.energyText.text = `Energy Core: ${this.registry.get('energy')}%`
        this.moneyText.text = `Money: $${this.registry.get('money')}`
        this.moraleText.text = `Minerals: ${this.registry.get('minerals')}`
    }
}