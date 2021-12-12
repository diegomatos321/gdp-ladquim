import Phaser from "phaser"
import CONSTANTS from "../constants.json"

import MesaBlank from "./prefabs/MesaBlank.js"
import VasoAntigo from "./prefabs/VasoAntigo.js"
import FinishGame from "../common/scripts/FinishGame"
import LoadingInterface from "../common/scripts/LoadingInterface"
import Rain from "./prefabs/Rain"

export default class ConservacaoEnergiaScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO });

    var rainSources
    var isRaining
    var grupoDeMesas
    var grupoDeAreasDeEfeito
    var pauseGame
  }

  init = () => {
    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
    this.isRaining = false
    this.rainSources = []
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width / 2, this.game.config.height / 2)
    this.loadImages();
  }

  create = () => {

    //Carregando variáveis
    this.grupoDeAreasDeEfeito = this.physics.add.staticGroup();

    //Adicionando background
    this.add.image(this.game.config.width/2, this.game.config.height/2,"background")

    // Configurando bordas de colisoes do mundo
    this.scene.launch(CONSTANTS.QUIMICA_CONSERVACAO_GUI);
    this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    // Grupo estatico de mesas
    this.grupoDeMesas = this.physics.add.staticGroup({ classType: MesaBlank });
    this.grupoDeMesas.get(this.game.config.width - 1150, this.game.config.height - 280);

    // Grupo de vasos
    let grupoDeItems = this.physics.add.group({ collideWorldBounds: true });

    // Criando vasos
    for (let index = 0; index < 1; index++) {
      const mesa = this.grupoDeMesas.getFirstAlive();
      const stepX = (mesa.displayWidth / 2 * index);

      let vasoAntigo = new VasoAntigo(this, (mesa.x - mesa.displayWidth / 4) + stepX, this.game.config.height / 2);
      grupoDeItems.add(vasoAntigo, true);
    };
    
    // Colisoes
    this.physics.add.collider(grupoDeItems, this.grupoDeMesas);

    // Overlap
    this.physics.add.overlap(grupoDeItems, this.grupoDeMesas, this.repositionVase);
    this.physics.add.overlap(grupoDeItems, this.grupoDeAreasDeEfeito, this.damageItem);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  update = () => {    
    this.rainSources.forEach((e) => {
      this.isRaining = e.updateRain();
    })
    this.generateRandomRainArea();

  }

  /**
   * 
   * Functions
   * 
   */
  loadImages = () => {
    this.load.image("vaso", new URL("./images/vaso-grego-antigo.png?quality=75&width=75", import.meta.url).pathname);
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
      const target = this.grupoDeMesas.getFirstAlive();
      let rainSource = new Rain(target, this, "raindrop");
      Rain.CreateEmitter(rainSource.raindropParticles, rainSource, this)
      this.rainSources.push(rainSource)
      this.grupoDeAreasDeEfeito.add(rainSource.rainHitArea, true);
    }
  }

  repositionVase = (item, mesa) => {
    if (item.state == "dragend") {
      item.setPosition(item.x, mesa.body.center.y - mesa.body.height / 2 - item.body.height / 2);
    }
  }

  damageItem = (item, damageSource) => {
    item.damageItem(damageSource.getData("power"))
  }

  cleanEvents = () => {
    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(null)
  }
}