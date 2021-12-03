import Phaser from "phaser"
import CONSTANTS from "../constants.json"

import Mesa from "./prefabs/Mesa.js"
import VasoAntigo from "./prefabs/VasoAntigo.js"
import FinishGame from "../common/scripts/FinishGame"
import LoadingInterface from "../common/scripts/LoadingInterface"

export default class ConservacaoEnergiaScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO });

    var pauseGame
  }

  init = () => {
    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
  }

  preload = () => {
    new LoadingInterface(this, this.game.config.width / 2, this.game.config.height / 2)

    this.loadImages();

    this.load.image('left-cap', new URL("./images/uipack-space/barHorizontal_green_left.png", import.meta.url).pathname)
    this.load.image('middle', new URL("./images/uipack-space/barHorizontal_green_mid.png", import.meta.url).pathname)
    this.load.image('right-cap', new URL("./images/uipack-space/barHorizontal_green_right.png", import.meta.url).pathname)

    this.load.image('left-cap-shadow', new URL("./images/uipack-space/barHorizontal_shadow_left.png", import.meta.url).pathname)
    this.load.image('middle-shadow', new URL("./images/uipack-space/barHorizontal_shadow_mid.png", import.meta.url).pathname)
    this.load.image('right-cap-shadow', new URL("./images/uipack-space/barHorizontal_shadow_right.png", import.meta.url).pathname)
  }

  create = () => {
    // ConservacaoPauseScene.LoadPauseScene(this)
    // Configurando bordas de colisoes do mundo
    this.scene.launch(CONSTANTS.QUIMICA_CONSERVACAO_GUI);
    this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    // Grupo estatico de mesas
    let grupoDeMesas = this.physics.add.staticGroup({ classType: Mesa });
    grupoDeMesas.get(200, this.game.config.height - 100);
    grupoDeMesas.get(this.game.config.width - 200, this.game.config.height - 100);

    // Grupo de vasos
    let grupoDeItems = this.physics.add.group({ collideWorldBounds: true });

    // Criando vasos
    for (let index = 0; index < 1; index++) {
      const mesa = grupoDeMesas.getFirstAlive();
      const stepX = (mesa.displayWidth / 2 * index);

      let vasoAntigo = new VasoAntigo(this, (mesa.x - mesa.displayWidth / 4) + stepX, this.game.config.height / 2);
      grupoDeItems.add(vasoAntigo, true);
    };

    // Raindrop particles
    const target1 = grupoDeMesas.getFirstAlive();
    let rainSource = new Phaser.Geom.Line(target1.x - target1.width / 2, 0, target1.x + target1.width / 2, 0);

    let raindropParticles = this.add.particles("raindrop");
    raindropParticles.createEmitter({
      speedY: 300,
      gravityY: this.game.config.physics.arcade.gravity.y,
      lifespan: 1000,
      quantity: 10,
      frequency: 20,
      rotate: -15,
      emitZone: {
        source: rainSource,
        type: "random"
      },
    });

    let rainHitArea = this.createRainHitArea(rainSource);

    // Grupo de áreas de efeito
    let grupoDeAreasDeEfeito = this.physics.add.staticGroup();
    grupoDeAreasDeEfeito.add(rainHitArea, true);

    // Colisoes
    this.physics.add.collider(grupoDeItems, grupoDeMesas);

    // Overlap
    this.physics.add.overlap(grupoDeItems, grupoDeMesas, this.repositionVase);
    this.physics.add.overlap(grupoDeItems, grupoDeAreasDeEfeito, this.damageItem);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
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
  }

  createRainHitArea = (rainSource) => {
    let widthOfRainHitArea = Phaser.Geom.Line.Length(rainSource);
    let heightOfRainHitArea = this.game.config.height - rainSource.y1;
    let rainHitArea = this.add.rectangle(rainSource.x1 + widthOfRainHitArea / 2, rainSource.y1 + heightOfRainHitArea / 2, widthOfRainHitArea, heightOfRainHitArea);
    rainHitArea.setData("power", 0.1);
    return rainHitArea;
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