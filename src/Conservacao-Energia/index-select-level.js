import Phaser from "phaser"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import GAME_CONSTANTS from "./GAME_CONSTANTS.json"

import crossSceneEventEmitter from "../Singletons/CrossSceneEventEmitter"

const STATES = {
  START: 0,
  PLAYING: 1,
  PAUSED: 2,
  FINISHED: 3,
}

export default class ConservacaoEnergiaSelectLevelScene extends Phaser.Scene {
  constructor() {
    super({ key: GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO_SELECT_LEVEL });
  }

  init = () => {
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(this.scene.key);
    this.currentLevel = 1;

    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);

    this.currentState = STATES.START;
  }

  preload = () => {
    this.loadImages();
  }

  create = () => {
    this.carregarElementosDaCena();

    // Eventos
    crossSceneEventEmitter.on(GAME_CONSTANTS.RETURN_TO_MENU, this.handleReturnToMenu)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  update = () => {
    
  }

  /**
   * 
   * Functions
   * 
   */
  loadImages = () => {
    this.load.image("select-level", new URL("./images/select-level.jpg?quality=75&width=800", import.meta.url).pathname);
    this.load.image("play-game", new URL("./images/play-game.png?quality=75&width=200", import.meta.url).pathname);

    this.load.image("level-1", new URL("./images/number-1.png?quality=75&width=200", import.meta.url).pathname);
    this.load.image("level-2", new URL("./images/number-2.png?quality=75&width=200", import.meta.url).pathname);
  }

  carregarElementosDaCena = () => {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "background")
    this.selectLevel = this.add.image(this.game.config.width/2, this.game.config.height/2, "select-level").setInteractive();
    this.playGame = this.add.image(this.game.config.width/1.2, this.game.config.height/2, "play-game").setInteractive();


    this.levelSprite = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'level-1');
    this.selectLevel.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleSelectLevelClicked)
    this.playGame.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleStartGame)
  }

  changePicture = () => {
    this.currentLevel++;

    if (this.currentLevel > 2)
    {
      this.currentLevel = 1;
    }
    this.levelSprite.setTexture("level-" + this.currentLevel)
}

  // Event Handlers
  handleReturnToMenu = () => {
    this.scene.start(GLOBAL_CONSTANTS.MAIN_MENU);
  }

  handleStartGame = () => {
    this.scene.start(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO, {level: this.currentLevel});
  }

  handleSelectLevelClicked = () => {
    this.changePicture();
  }


  cleanEvents = (sys) => {
    console.log("Cleaning Events from Conservacao Energia Minigame Select Level")
    this.GameManager.setCurrentScene(null)

    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_ALL_AUDIO);
    crossSceneEventEmitter.removeListener(GAME_CONSTANTS.RETURN_TO_MENU, this.handleReturnToMenu)
    sys.scene.events.removeListener(GAME_CONSTANTS.START_GAME, this.handleStartGame)
    sys.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }
}