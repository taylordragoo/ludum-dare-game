import Phaser from 'phaser';
import BoardPlugin from './plugins/board-plugin.js';
import rexUI from './plugins/rexuiplugin.min.js'
import rexPathFollower from './plugins/pathfollower.js';
import Preload from './scenes/Preload.js';
import MainMenu from './scenes/MainMenu.js';
import HUD from './scenes/Hud.js'
import GalaxyMap from './scenes/GalaxyMap';
import Level from './scenes/Level.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    scene: [{
      key: 'rexBoard',
      plugin: BoardPlugin,
      mapping: 'rexBoard'
    },
    {
      key: 'rexuiplugin',
      plugin: rexUI,
      mapping: 'rexUI'
    },
    {
      key: 'rexPathFollower',
      plugin: rexPathFollower,
      start: true
    }],
  },
  // parent: "game",
  scene: [Preload,MainMenu,HUD,GalaxyMap,Level]
};

const game = new Phaser.Game(config);
