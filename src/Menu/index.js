import Phaser from "phaser"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import MODAL_CONSTANTS from "./MODAL_CONSTANTS.json"
import menuAtlas from "./atlas/menu-textures.json"
import LoadingInterface from "../common/scripts/LoadingInterface"
import MainMenuContainer from "./modals/MainMenuContainer"
import ConfiguracoesContainer from "../common/modals/ConfiguracoesContainer"
import CreditosContainer from "../common/modals/CreditosContainer"
import CrossSceneEventEmitter from "../Singletons/CrossSceneEventEmitter"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: GLOBAL_CONSTANTS.MAIN_MENU});

    this.currentContainerKey = MODAL_CONSTANTS.MENU;
    this.mapOfModals = new Map();
    var music
  }

  init = () => {
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(this.scene.key)
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width/2, this.game.config.height/2)
    this.load.atlas("menu-atlas", new URL("./atlas/menu-textures.png", import.meta.url).pathname, menuAtlas);
    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.audio('bossa-lofi', new URL("./sounds/BossaLofi.mp3", import.meta.url).pathname);
  }

  create = () => {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-atlas", "fundo");
    this.add.image(40, 50, "menu-atlas", "ladquim-logo").setOrigin(0, 0);

    // this.music = this.sound.add('bossa-lofi');
    // this.music.play();
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_BACKGROUND_MUSIC, "bossa-lofi")

    const mainMenuContainer = new MainMenuContainer(this);
    mainMenuContainer.setVisible(false);
    this.mapOfModals.set(MODAL_CONSTANTS.MENU, mainMenuContainer)

    let configuracoesContainer = new ConfiguracoesContainer(this, this.game.config.width/2, this.game.config.height/2);
    configuracoesContainer.setVisible(false)

    let creditosContainer = new CreditosContainer(this, this.game.config.width/2, this.game.config.height/2);
    creditosContainer.setVisible(false)

    this.mapOfModals.set(MODAL_CONSTANTS.CONFIGURACOES, configuracoesContainer);
    this.mapOfModals.set(MODAL_CONSTANTS.CREDITOS, creditosContainer);
    
    this.mapOfModals.get(this.currentContainerKey).setVisible(true);
    
    configuracoesContainer.on(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED, this.goToMenu);
    creditosContainer.on(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED, this.goToMenu);
    this.events.on(GLOBAL_CONSTANTS.SHOW_MODAL, this.changeModal)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.stopBackgroundMusic);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  goToMenu = () => {
    this.changeModal(MODAL_CONSTANTS.MENU)
  }

  changeModal = (modalName) => {
    const currentContainer = this.mapOfModals.get(this.currentContainerKey);
    const containerToShow = this.mapOfModals.get(modalName);

    currentContainer?.setVisible(false);
    containerToShow?.setVisible(true);

    this.currentContainerKey = modalName;
  }

  stopBackgroundMusic = () => {
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_BACKGROUND_MUSIC)
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from: Menu SCENE")

    this.GameManager.setCurrentScene(null)

    const configuracoesContainer = this.mapOfModals.get(MODAL_CONSTANTS.CONFIGURACOES)
    const creditosContainer = this.mapOfModals.get(MODAL_CONSTANTS.CREDITOS)
    configuracoesContainer.removeListener(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED, this.goToMenu);
    creditosContainer.removeListener(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED, this.goToMenu);
    sys.scene.events.removeListener(GLOBAL_CONSTANTS.SHOW_MODAL, this.changeModal)
    sys.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.stopBackgroundMusic);
    // this.music.stop()
  }
}