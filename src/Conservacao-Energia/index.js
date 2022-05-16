import Phaser from "phaser"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import GAME_CONSTANTS from "./GAME_CONSTANTS.json"
import ESTATUA_CONSTANTS from "./Objects/constants/ESTATUA_CONSTANTS.json"
import CrossSceneEventEmitter from "../Singletons/CrossSceneEventEmitter"


import MesaBlank from "./Objects/MesaBlank.js"
import EstatuaMadeira from "./Objects/EstatuaMadeira.js"
import EstatuaBronze from "./Objects/EstatuaBronze"
import EstatuaMarmore from "./Objects/EstatuaMarmore"
import Verniz from "./Objects/Verniz.js"
import LoadingInterface from "../common/scripts/LoadingInterface"
import Rain from "./Objects/Rain"

const STATES = {
  START: 0,
  PLAYING: 1,
  PAUSED: 2,
  FINISHED: 3,
}

export default class ConservacaoEnergiaScene extends Phaser.Scene {
  constructor() {
    super({ key: GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO });

    this.currentState = STATES.START;

    var rainSources
    var isRaining
    var grupoDeMesas
    var grupoDeAreasDeEfeito
    var grupoDeVerniz
    var pauseGame
  }

  init = () => {
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(this.scene.key)

    this.isRaining = false
    this.rainSources = []
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width / 2, this.game.config.height / 2)
    this.loadImages();
    this.loadSounds();
  }

  create = () => {
    // Executa o GUI do Minigame
    this.scene.launch(GAME_CONSTANTS.GUI);
    
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

    // Colisoes
    this.physics.add.collider(this.gruposDeEstatuas, this.grupoDeMesas);

    // Overlap
    this.physics.add.overlap(this.gruposDeEstatuas, this.grupoDeMesas, this.repositionStatue);
    this.physics.add.overlap(this.gruposDeEstatuas, this.grupoDeAreasDeEfeito, this.damageItem);
    this.physics.add.overlap(this.gruposDeEstatuas, this.grupoDeVerniz, this.vernizCollideEstatua);

    // Eventos
    this.GameManager.events.on(GLOBAL_CONSTANTS.PAUSED, this.handlePauseScene)
    this.events.on(GAME_CONSTANTS.RETURN_TO_MENU, this.handleReturnToMenu)
    this.events.on(GAME_CONSTANTS.START_GAME, this.handleStartGame)
    this.events.on(GAME_CONSTANTS.GAME_FINISHED, this.handleFinishedGame)
    this.events.on(GAME_CONSTANTS.RESTART_GAME, this.handleRestartGame)
    this.events.on(GAME_CONSTANTS.SHOW_INSTRUCOES, this.handleShowInstrucoes)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  update = () => {    
    this.rainSources.forEach((e) => {
      this.isRaining = e.updateRain();
    })
    this.generateRandomRainArea();
    this.generateRandomVerniz();
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
    this.load.image("verniz", new URL("./images/verniz.png?quality=100&width=100", import.meta.url).pathname);
    this.load.image("mesa", new URL("./images/desk-sprite.png?quality=75&width=300", import.meta.url).pathname);
    this.load.image("raindrop", new URL("./images/raindrop-2d-sprite.png?quality=75&width=8", import.meta.url).pathname);

    this.load.image('background', new URL("./images/background.jpg", import.meta.url).pathname)

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
  }

  carregarElementosDoJogo = () => {
    //Carregando variáveis
    this.grupoDeAreasDeEfeito = this.physics.add.staticGroup();

    //Adicionando background
    this.add.image(this.game.config.width/2, this.game.config.height/2,"background")

    // Configurando bordas de colisoes do mundo
    this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    // Grupo estatico de mesas
    this.grupoDeMesas = this.physics.add.staticGroup({ classType: MesaBlank });
    this.grupoDeMesas.get(this.game.config.width - 1150, this.game.config.height - 280);

    // Grupos de itens
    this.gruposDeEstatuas = this.physics.add.group({ collideWorldBounds: true });
    this.grupoDeVerniz = this.physics.add.group({ collideWorldBounds: true });


    // Criando vasos
    for (let index = 0; index < 1; index++) {
      const mesa = this.grupoDeMesas.getFirstAlive();
      const stepX = (mesa.displayWidth / 2 * index);

      let estatuaMadeira = new EstatuaMadeira(this, (mesa.x - mesa.displayWidth / 4) + stepX, this.game.config.height / 2);
      this.gruposDeEstatuas.add(estatuaMadeira, true);

      let estatuaBronze = new EstatuaBronze(this, (mesa.x - mesa.displayWidth / 4) + stepX + 100, this.game.config.height / 2);
      this.gruposDeEstatuas.add(estatuaBronze, true);

      let estatuaMarmore = new EstatuaMarmore(this, (mesa.x - mesa.displayWidth / 4) + stepX - 100, this.game.config.height / 2);
      this.gruposDeEstatuas.add(estatuaMarmore, true);
    };    
  }

  // Event Handlers

  handlePauseScene = () => {
    this.currentState = STATES.PAUSED;
    this.scene.isPaused() ? this.scene.get(GAME_CONSTANTS.GUI).scene.resume() : this.scene.get(GAME_CONSTANTS.GUI).scene.pause()
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
    this.scene.restart(this.scene.key);
    this.scene.restart(this.scene.key + "-gui");
  }

  handleFinishedGame = () => {
    this.pauseGame();
    this.scene.launch(GAME_CONSTANTS.FINISH_GAME_MODAL);
  }

  handleShowInstrucoes = () => {
    this.pauseGame();
    this.scene.launch(GAME_CONSTANTS.START_GAME_MODAL)
  }

  pauseGame = () => {
    this.scene.pause(this.scene.key);
    this.scene.pause(this.scene.key + "-gui");
  }

  // Verniz

  generateRandomVerniz = () => {
    let randomNumber = Phaser.Math.Between(0, 500);

    if (randomNumber < 1) {
      let verniz = new Verniz(this, (this.game.config.width / 2) + 200, (this.game.config.height / 3 ) + randomNumber);
      this.grupoDeVerniz.add(verniz, true)
    }
  }

  vernizCollideEstatua = (estatua, vernizItem) => {
    if(estatua.getData("tipo-estatua") == ESTATUA_CONSTANTS.MADEIRA) {
      estatua.healItem(vernizItem.getData("power"))
      CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "heal-sfx")
    } else {
      estatua.damageItem(vernizItem.getData("power"))
      CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "damage-sfx")
    }

    vernizItem.destroy()
    
  }



  // Chuva

  createRainHitArea = (rainSource) => {
    let widthOfRainHitArea = Phaser.Geom.Line.Length(rainSource);
    let heightOfRainHitArea = this.game.config.height - rainSource.y1;
    let rainHitArea = this.add.rectangle(rainSource.x1 + widthOfRainHitArea / 2, rainSource.y1 + heightOfRainHitArea / 2, widthOfRainHitArea, heightOfRainHitArea);
    rainHitArea.setData("power", 0.1);
    return rainHitArea;
  }

  generateRandomRainArea = () => {
    let randomNumber = Phaser.Math.Between(0, 500);

    if (randomNumber < 1 && !this.isRaining) {
      this.isRaining = true
      let randomPos = Phaser.Math.Between(0, this.scale.baseSize.width - 400);
      let rainSource = new Rain(randomPos, this, "raindrop");
      Rain.CreateEmitter(rainSource.raindropParticles, rainSource, this)
      this.rainSources.push(rainSource)
      this.grupoDeAreasDeEfeito.add(rainSource.rainHitArea, true);
    }
  }

  // Estátua

  repositionStatue = (item, mesa) => {
    if (item.state == "dragend") {
      item.setPosition(item.x, mesa.body.center.y - mesa.body.height / 2 - item.body.height / 2);
    }
  }

  damageItem = (item, damageSource) => {
    item.damageItem(damageSource.getData("power"))
  }

  // Eventos

  cleanEvents = (sys) => {
    console.log("Cleaning Events from Conservacao Energia Minigame")
    this.GameManager.setCurrentScene(null)

    this.GameManager.events.removeListener(GLOBAL_CONSTANTS.PAUSED, this.handlePauseScene)
    sys.scene.events.removeListener(GAME_CONSTANTS.RETURN_TO_MENU, this.handleReturnToMenu)
    sys.scene.events.removeListener(GAME_CONSTANTS.START_GAME, this.handleStartGame)
    sys.scene.events.removeListener(GAME_CONSTANTS.GAME_FINISHED, this.handleFinishedGame)
    sys.scene.events.removeListener(GAME_CONSTANTS.RESTART_GAME, this.handleRestartGame)
    sys.scene.events.removeListener(GAME_CONSTANTS.SHOW_INSTRUCOES, this.handleShowInstrucoes)
  }
}