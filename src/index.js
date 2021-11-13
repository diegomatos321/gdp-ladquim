import Phaser from "phaser"
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js'
import MenuScene from "./Menu"
import ConservacaoEnergiaScene from "./Conservacao-Energia"

let config = {
  title: "LADQUIM - Conservação e Restauração",
  version: "1.0.0",
  width: 1920,
  height: 1080,
  parent: "game-container",
  type: Phaser.AUTO,
  backgroundColor: "#00b3ff",
  dom: {
    createContainer: true
  },
  scale: {
    width: 1920,
    height: 1080,
    parent: "game-container",
    fullscreenTarget: "game-container",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoFocus: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: true
    }
  },
  plugins: {
    global: [{
      key: "rexNinePatchPlugin",
      plugin: NinePatchPlugin,
      start: true
    }]
  },
  banner: true,
  url: "https://ladquim.iq.ufrj.br/",
  scene: [MenuScene, ConservacaoEnergiaScene]
};

document.addEventListener("DOMContentLoaded", () => new Phaser.Game(config))