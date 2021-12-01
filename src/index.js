import Phaser from "phaser"
import PreloadScene from "./preload"
import MenuScene from "./Menu"
import GameManager from "./Singletons/GameManager"
import ConservacaoEnergiaScene from "./Conservacao-Energia"
import ConservacaoPauseScene from "./Conservacao-Energia/components/ConservacaoPauseScene"

let config = {
  title: "LADQUIM - Conservação e Restauração",
  version: "0.1.0",
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
  banner: true,
  url: "https://ladquim.iq.ufrj.br/",
  scene: [PreloadScene, GameManager, MenuScene, ConservacaoEnergiaScene, ConservacaoPauseScene]
};

document.addEventListener("DOMContentLoaded", () => new Phaser.Game(config))