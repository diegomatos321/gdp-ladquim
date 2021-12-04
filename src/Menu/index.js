import Phaser from "phaser"
import CONSTANTS from "../constants.json"
import MODAL_CONSTANTS from "./MODAL_CONSTANTS.json"
import menuAtlas from "./atlas/menu-textures.json"
import LoadingInterface from "../common/scripts/LoadingInterface"
import MainMenuContainer from "./scripts/MainMenuContainer"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});

    this.currentContainerKey = MODAL_CONSTANTS.MENU;
    this.mapOfModals = new Map();
  }

  init = () => {
    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(CONSTANTS.MAIN_MENU)
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width/2, this.game.config.height/2)
    this.load.atlas("menu-atlas", new URL("./atlas/menu-textures.png", import.meta.url).pathname, menuAtlas);
    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
  }

  create = () => {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-atlas", "fundo");
    this.add.image(40, 50, "menu-atlas", "ladquim-logo").setOrigin(0, 0);

    const mainMenuContainer = new MainMenuContainer(this, 0, 0);
    this.mapOfModals.set(MODAL_CONSTANTS.MENU, mainMenuContainer)
    
    this.events.on(CONSTANTS.SHOW_MODAL, this.changeModal)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  changeModal = (modalName) => {
    // console.log("Hide " + this.currentModal)
    const currentContainer = this.mapOfModals.get(this.currentContainerKey);
    if (currentContainer != null) {
      currentContainer.setVisible(false);
    }

    console.log("Show " + modalName)
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from: Menu SCENE")

    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(null)
  }
}