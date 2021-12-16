import Phaser from "phaser"
import CONSTANTS from "../GLOBAL_CONSTANTS.json"
import MODAL_CONSTANTS from "./MODAL_CONSTANTS.json"
import menuAtlas from "./atlas/menu-textures.json"
import LoadingInterface from "../common/scripts/LoadingInterface"
import MainMenuContainer from "./modals/MainMenuContainer"
import ConfiguracoesContainer from "../common/modals/ConfiguracoesContainer"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});

    this.currentContainerKey = MODAL_CONSTANTS.MENU;
    this.mapOfModals = new Map();
  }

  init = () => {
    this.GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(CONSTANTS.MAIN_MENU)
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width/2, this.game.config.height/2)
    this.load.atlas("menu-atlas", new URL("./atlas/menu-textures.png", import.meta.url).pathname, menuAtlas);
    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
  }

  create = () => {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-atlas", "fundo");
    this.add.image(40, 50, "menu-atlas", "ladquim-logo").setOrigin(0, 0);

    const mainMenuContainer = new MainMenuContainer(this);
    mainMenuContainer.setVisible(false);
    this.mapOfModals.set(MODAL_CONSTANTS.MENU, mainMenuContainer)

    let configuracoesContainer = new ConfiguracoesContainer(this, this.game.config.width/2, this.game.config.height/2);
    configuracoesContainer.setVisible(false)
    configuracoesContainer.on(CONSTANTS.BACK_ARROW_CLICKED, this.goToMenu);
    this.mapOfModals.set(MODAL_CONSTANTS.CONFIGURACOES, configuracoesContainer);
    
    this.mapOfModals.get(this.currentContainerKey).setVisible(true);
    
    this.events.on(CONSTANTS.SHOW_MODAL, this.changeModal)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  goToMenu = () => {
    console.log("FOI")
    this.changeModal(MODAL_CONSTANTS.MENU)
  }

  changeModal = (modalName) => {
    const currentContainer = this.mapOfModals.get(this.currentContainerKey);
    const containerToShow = this.mapOfModals.get(modalName);

    currentContainer?.setVisible(false);
    containerToShow?.setVisible(true);

    this.currentContainerKey = modalName;
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from: Menu SCENE")

    this.GameManager.setCurrentScene(null)
  }
}