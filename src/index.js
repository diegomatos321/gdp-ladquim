import Phaser from "phaser"
import GameManager from "./Singletons/GameManager"
import PreloadScene from "./preload"
import MenuScene from "./Menu"
import InicioConservacaoEnergiaScene from "./Conservacao-Energia/inicio-minigame"
import ConservacaoEnergiaScene from "./Conservacao-Energia/minigame"
import FimConservacaoEnergiaScene from "./Conservacao-Energia/fim-minigame"
import ConservacaoGUI from "./Conservacao-Energia/GUI"

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
  scene: [PreloadScene, GameManager, MenuScene, InicioConservacaoEnergiaScene, ConservacaoEnergiaScene, FimConservacaoEnergiaScene, ConservacaoGUI]
};

document.addEventListener("DOMContentLoaded", () => new Phaser.Game(config))