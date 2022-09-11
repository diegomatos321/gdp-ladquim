import Phaser from "phaser"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import GAME_CONSTANTS from "./GAME_CONSTANTS.json"
import GAME_OBJECT_CONSTANTS from "./GAME_OBJECT_CONSTANTS.json"
import LEVELS_CONFIG from "./LEVELS_CONFIG.json"

import LoadingInterface from "../common/scripts/LoadingInterface"
import crossSceneEventEmitter from "../Singletons/CrossSceneEventEmitter"
import BaseObject from "./GameObjects/BaseObject"
import AdversityFactory from "./Factories/AdversityFactory"
import UsableItemFactory from "./Factories/UsableItemFactory";

const STATES = {
  START: 0,
  PLAYING: 1,
  PAUSED: 2,
  FINISHED: 3,
}

export default class ConservacaoEnergiaScene extends Phaser.Scene {
    inventario = {};

  constructor() {
    super({ key: GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO });
    var pauseGame
  }

  init = (data) => {
    console.log("Nível Selecionado: " + data.level)
    console.log(this)
    this.currentLevel = data.level;
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(this.scene.key)

    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);

    this.inventario = LEVELS_CONFIG["level" + data.level];

    this.currentState = STATES.START;
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width / 2, this.game.config.height / 2)
    this.loadImages();
    this.loadSounds();
  }

  create = (data) => {
    // Executa o GUI do Minigame
    console.log("Av")
    console.log(data)
    this.scene.launch(GAME_CONSTANTS.GUI, this.inventario);
    
    if (this.currentState === STATES.START || this.currentState === STATES.FINISHED) {
      this.scene.pause(this.scene.key);
      this.scene.pause(this.scene.key + "-gui");
      
      if (this.currentState === STATES.START) {
        this.scene.launch(GAME_CONSTANTS.START_GAME_MODAL);
      } else if (this.currentState === STATES.FINISHED) {
        this.scene.launch(GAME_CONSTANTS.FINISH_GAME_MODAL);
      }
    } else if (this.currentState === STATES.PLAYING) {
      this.scene.resume(this.scene.key);
      this.scene.resume(this.scene.key + "-gui");
    }
    
    this.carregarElementosDoJogo();

    // Overlap
    this.physics.add.overlap(this.objectsGroup, this.adversityGroup, this.damageItem);
    this.physics.add.overlap(this.objectsGroup, this.usableItemGroup, this.handleUsableOverlap);

    // Eventos
    crossSceneEventEmitter.on(GLOBAL_CONSTANTS.PAUSED, this.handlePauseScene)
    crossSceneEventEmitter.on(GAME_CONSTANTS.RETURN_TO_MENU, this.handleReturnToMenu)
    crossSceneEventEmitter.on(GAME_CONSTANTS.GAME_FINISHED, this.handleFinishedGame)
    crossSceneEventEmitter.on(GAME_CONSTANTS.ITEM_SELECTED, this.handleItemSelected);

    this.input.on(Phaser.Input.Events.DRAG_START, this.handleDragStart);
    this.input.on(Phaser.Input.Events.DRAG, this.handleDrag);
    this.input.on(Phaser.Input.Events.DRAG_END, this.handleDragEnd);
    this.events.on(GAME_CONSTANTS.START_GAME, this.handleStartGame)
    this.events.on(GAME_CONSTANTS.RESTART_GAME, this.handleRestartGame)
    this.events.on(GAME_CONSTANTS.SHOW_INSTRUCOES, this.handleShowInstrucoes)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  update = () => {
    // Paleativo para não gerar + de 1 adversidade
    if (this.adversityGroup.children.entries.length >= 1) {
    } else {
      this.generateRandomAdversityArea();
    }
  }

  /**
   * 
   * Functions
   * 
   */
  loadImages = () => {
    this.load.image("estatua-madeira", new URL("./images/estatua-madeira.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("estatua-bronze", new URL("./images/estatua-bronze.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("estatua-marmore", new URL("./images/estatua-marmore.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("quadro-sorriso-1", new URL("./images/quadro-sorriso-2.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("quadro-sorriso-2", new URL("./images/quadro-sorriso-2-2.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("quadro-sorriso-3", new URL("./images/quadro-sorriso-2-3.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("livro", new URL("./images/livro.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("tecido", new URL("./images/tecido.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("verniz", new URL("./images/verniz.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("espanador", new URL("./images/espanador.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("limpeza", new URL("./images/limpeza3.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("lixo", new URL("./images/lixo.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("lixo-comida", new URL("./images/lixo-comida2.png?quality=50&width=200", import.meta.url).pathname);
    this.load.image("comida-rosquinha", new URL("./images/comida-rosquinha.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("comida-maca", new URL("./images/comida-maca.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("raindrop", new URL("./images/gota-chuva.png?quality=75&width=8", import.meta.url).pathname);
    this.load.image("sol", new URL("./images/sol.png?quality=75&width=400", import.meta.url).pathname);
    this.load.image("fogo", new URL("./images/fogo2.png?quality=75&width=150", import.meta.url).pathname);
    this.load.image("nuvem", new URL("./images/nuvem.png?quality=75&width=400", import.meta.url).pathname);
    this.load.image("folhas", new URL("./images/folhas.png?quality=75&width=400", import.meta.url).pathname);

    this.load.image('background', new URL("./images/background.jpg", import.meta.url).pathname)
    this.load.image('slot-inventario', new URL("./images/slot-inventario.png", import.meta.url).pathname)

    this.load.image('left-cap', new URL("./images/uipack-space/barHorizontal_green_left.png", import.meta.url).pathname)
    this.load.image('middle', new URL("./images/uipack-space/barHorizontal_green_mid.png", import.meta.url).pathname)
    this.load.image('right-cap', new URL("./images/uipack-space/barHorizontal_green_right.png", import.meta.url).pathname)

    this.load.image('left-cap-shadow', new URL("./images/uipack-space/barHorizontal_shadow_left.png", import.meta.url).pathname)
    this.load.image('middle-shadow', new URL("./images/uipack-space/barHorizontal_shadow_mid.png", import.meta.url).pathname)
    this.load.image('right-cap-shadow', new URL("./images/uipack-space/barHorizontal_shadow_right.png", import.meta.url).pathname)
  }

  loadSounds = () => {
    this.load.audio('heal-sfx', new URL("./sounds/heal-sfx.mp3", import.meta.url).pathname);
    this.load.audio('damage-sfx', new URL("./sounds/damage-sfx.mp3", import.meta.url).pathname);
    this.load.audio('rain-sfx', new URL("./sounds/rain-sfx.mp3", import.meta.url).pathname);
    this.load.audio('sun-birds-sfx', new URL("./sounds/sun-birds-sfx.mp3", import.meta.url).pathname);
    this.load.audio('sweeping-sfx', new URL("./sounds/sweeping-sfx.mp3", import.meta.url).pathname);
    this.load.audio('fire-sfx', new URL("./sounds/fire-sfx.mp3", import.meta.url).pathname);
    this.load.audio('garbage-sfx', new URL("./sounds/garbage-sfx.mp3", import.meta.url).pathname);
    this.load.audio('water-sfx', new URL("./sounds/water-sfx.mp3", import.meta.url).pathname);
  }

  carregarElementosDoJogo = () => {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "background")

    // Configurando bordas de colisoes do mundo
    this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    // Grupos de itens
    this.adversityGroup = this.add.group();
    this.objectsGroup = this.physics.add.group({ collideWorldBounds: true });
    this.usableItemGroup = this.physics.add.group({ collideWorldBounds: true });

    this.loadLevel();
  }

  // Levels

  loadLevel = () => {
    console.log("dadsasdadsa");
    console.log(this.currentLevel);
    switch (this.currentLevel) {
      case 1:
          this.handleLoadLevel1();
          break;
      case 2:
          this.handleLoadLevel2();
          break;
      default:
          break;
    }
  }


  handleLoadLevel1 = () => {
    let estatuaMadeira = new BaseObject(this, (this.GAME_WIDTH / 2) - 300, this.GAME_HEIGHT / 2, "estatua-madeira").setData("tipo-estatua", GAME_OBJECT_CONSTANTS.MADEIRA);
    let estatuaMarmore = new BaseObject(this, this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, "estatua-marmore").setData("tipo-estatua", GAME_OBJECT_CONSTANTS.MARMORE);
    let estatuaBronze = new BaseObject(this, (this.GAME_WIDTH / 2) + 300, this.GAME_HEIGHT / 2, "estatua-bronze").setData("tipo-estatua", GAME_OBJECT_CONSTANTS.BRONZE);

    this.objectsGroup.addMultiple([estatuaMadeira, estatuaMarmore, estatuaBronze], true);

  }

  handleLoadLevel2 = () => {
    let estatuaMadeira = new BaseObject(this, (this.GAME_WIDTH / 2) - 300, this.GAME_HEIGHT / 2, "estatua-madeira").setData("tipo-estatua", GAME_OBJECT_CONSTANTS.MADEIRA);
    let estatuaMarmore = new BaseObject(this, this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, "estatua-marmore").setData("tipo-estatua", GAME_OBJECT_CONSTANTS.MARMORE);
    let estatuaBronze = new BaseObject(this, (this.GAME_WIDTH / 2) + 300, this.GAME_HEIGHT / 2, "estatua-bronze").setData("tipo-estatua", GAME_OBJECT_CONSTANTS.BRONZE);
    let quadro1 = new BaseObject(this, (this.GAME_WIDTH / 2) - 450, this.GAME_HEIGHT / 2, "quadro-sorriso-1").setData("tipo-quadro", GAME_OBJECT_CONSTANTS.QUADROSORRISO1);
    let quadro2 = new BaseObject(this, (this.GAME_WIDTH / 2) + 450, this.GAME_HEIGHT / 2, "quadro-sorriso-2").setData("tipo-quadro", GAME_OBJECT_CONSTANTS.QUADROSORRISO2);
    let quadro3 = new BaseObject(this, (this.GAME_WIDTH / 2) + 600, this.GAME_HEIGHT / 2, "quadro-sorriso-3").setData("tipo-quadro", GAME_OBJECT_CONSTANTS.QUADROSORRISO3);
    let livro = new BaseObject(this, (this.GAME_WIDTH / 2), this.GAME_HEIGHT / 3, "livro").setData("livro", GAME_OBJECT_CONSTANTS.LIVRO);
    let tecido = new BaseObject(this, (this.GAME_WIDTH / 2) + 300, this.GAME_HEIGHT / 3, "tecido").setData("tecido", GAME_OBJECT_CONSTANTS.TECIDO);

    this.objectsGroup.addMultiple([estatuaMadeira, estatuaMarmore, estatuaBronze,quadro1,quadro2,quadro3, livro, tecido], true);
  }

  // Event Handlers

  handlePauseScene = () => {
    this.currentState = STATES.PAUSED;
    const guiScene = this.scene.get(GAME_CONSTANTS.GUI);

    if (guiScene.scene.isPaused()) {
      crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.RESUME_ALL_AUDIO);
      guiScene.scene.resume();
    } else {
      crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PAUSE_ALL_AUDIO);
      guiScene.scene.pause();
    }
  }

  handleReturnToMenu = () => {
    this.scene.start(GLOBAL_CONSTANTS.MAIN_MENU);
  }

  handleStartGame = () => {
    this.scene.resume(this.scene.key);
    this.scene.resume(this.scene.key + "-gui");
    this.GameManager.setCurrentScene(this.scene.key)
  }

  handleRestartGame = () => {
    this.scene.restart({level: this.currentLevel});
  }

  handleFinishedGame = () => {
    this.pauseGame();
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_ALL_AUDIO);
    this.scene.launch(GAME_CONSTANTS.FINISH_GAME_MODAL);
  }

  handleShowInstrucoes = () => {
    this.pauseGame();
    this.scene.launch(GAME_CONSTANTS.START_GAME_MODAL)
  }

  handleDragStart = (pointer, gameObject) => {
    gameObject.setState("dragstart");
  }

  handleDrag = (pointer, gameObject, dragX, dragY) => {
    gameObject.setPosition(dragX, dragY);
  }

  handleDragEnd = (pointer, gameObject) => {
    gameObject.setState("dragend", true);
  }

  pauseGame = () => {
    this.scene.pause(this.scene.key);
    this.scene.pause(this.scene.key + "-gui");
  }

  handleItemSelected = (itemName) => {
    const usableItem = UsableItemFactory(this, this.input.x, this.input.y, itemName);
    this.usableItemGroup.add(usableItem);
  }

  handleUsableOverlap = (object, collectable) => {
    collectable.usedBy(object);
  }

  generateRandomAdversityArea = () => {
    let randomNumber = Phaser.Math.Between(0, 500);

    if (randomNumber < 1) {
      let randomPosX = Phaser.Math.Between(0, this.GAME_WIDTH - 400);
      let randomPosY = Phaser.Math.Between(0, this.GAME_HEIGHT);

      const adversity = AdversityFactory(this, randomPosX, randomPosY);

      this.adversityGroup.add(adversity, true);
    }
  }

  damageItem = (adversity, object) => {
    adversity.dealsDamage(object);
  }

  cleanEvents = (sys) => {
    console.log("Cleaning Events from Conservacao Energia Minigame");
    this.textures.remove("background");
    this.GameManager.setCurrentScene(null);

    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_ALL_AUDIO);

    crossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.PAUSED, this.handlePauseScene);
    crossSceneEventEmitter.removeListener(GAME_CONSTANTS.RETURN_TO_MENU, this.handleReturnToMenu);
    crossSceneEventEmitter.removeListener(GAME_CONSTANTS.GAME_FINISHED, this.handleFinishedGame);

    sys.scene.input.removeListener(Phaser.Input.Events.DRAG_START, this.handleDragStart);
    sys.scene.input.removeListener(Phaser.Input.Events.DRAG, this.handleDrag);
    sys.scene.input.removeListener(Phaser.Input.Events.DRAG_END, this.handleDragEnd);
    sys.scene.events.removeListener(GAME_CONSTANTS.START_GAME, this.handleStartGame);
    sys.scene.events.removeListener(GAME_CONSTANTS.RESTART_GAME, this.handleRestartGame);
    sys.scene.events.removeListener(GAME_CONSTANTS.SHOW_INSTRUCOES, this.handleShowInstrucoes);
    sys.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }
}