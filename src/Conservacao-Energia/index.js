import Phaser from "phaser"
import CONSTANTS from "../constants.json"

import fullScreenBtn from "../common/scripts/fullScreenBtn"
import Mesa from "./prefabs/Mesa.js"
import VasoAntigo from "./prefabs/VasoAntigo.js"
import GameTimer from "./prefabs/GameTimer"
import FinishGame from "../common/scripts/FinishGame"
import ConservacaoPauseScene from "./components/ConservacaoPauseScene"

export default class ConservacaoEnergiaScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO});

    var gameTimer
    var pauseGame
    
  }

  preload() {
    this.loadingContainer = this.createLoadingInterface();
    this.checkOrientation(this.scale.orientation);
    this.loadImages();
  }

  create() {
    ConservacaoPauseScene.LoadPauseScene(this)
    // Configurando bordas de colisoes do mundo
    this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

    this.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.checkOrientation);

    new fullScreenBtn(this);
    
    // Grupo estatico de mesas
    let grupoDeMesas = this.physics.add.staticGroup({classType: Mesa});
    grupoDeMesas.get(200, this.game.config.height-100);
    grupoDeMesas.get(this.game.config.width - 200, this.game.config.height-100);

    // Grupo de vasos
    let grupoDeItems = this.physics.add.group({collideWorldBounds: true});

    // Criando vasos
    for (let index = 0; index < 2; index++) {
      const mesa = grupoDeMesas.getFirstAlive();
      const stepX = (mesa.displayWidth/2*index);

      let vasoAntigo = new VasoAntigo(this, (mesa.x - mesa.displayWidth/4) + stepX, this.game.config.height/2);
      grupoDeItems.add(vasoAntigo, true);
    };
    
    // Raindrop particles
    const target1 = grupoDeMesas.getFirstAlive();
    let rainSource = new Phaser.Geom.Line(target1.x - target1.width/2, 0, target1.x + target1.width/2, 0);
        
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

    this.gameTimer = new GameTimer(this,240,36)
  }

  update() {
    
    this.gameTimer.updateTimer()
    if(this.gameTimer.hasEnded) {
      FinishGame.FinishToMainMenu(this)
  }

  }

  /**
   * 
   * Functions
   * 
   */
  
  createLoadingInterface() {
    const offSetX = this.game.config.width / 4;
    const maxProgressWidth = this.game.config.width / 2;

    let progressGraphic = this.add.graphics();

    let shape = new Phaser.Geom.Rectangle(-offSetX, 0, 0, 16);
    let rectShape = progressGraphic.fillRectShape(shape);

    let textProgress = this.add.text(0, 8, "0%").setOrigin(0.5, 0.5);
    let fileProgressText = this.add.text(-offSetX, 32, "Iniciando Cena...").setOrigin(0, 0.5);

    let loadingContainer = this.add.container(this.game.config.width / 2, this.game.config.height / 2, [rectShape, textProgress, fileProgressText]);

    this.load.on(Phaser.Loader.Events.FILE_PROGRESS, handleFileProgressBar);
    this.load.on(Phaser.Loader.Events.PROGRESS, handleProgressBar);
    this.load.on(Phaser.Loader.Events.COMPLETE, handleCompleteProgressBar);

    function handleCompleteProgressBar() {
      fileProgressText.setText("Carregamento Completo");
      loadingContainer.destroy();
    }

    function handleFileProgressBar(file, progress) {
      progressGraphic.clear();
      progressGraphic.fillStyle(0xffffff, 0.4);
      shape.width = progress * maxProgressWidth;
      rectShape = progressGraphic.fillRectShape(shape);

      fileProgressText.setText(`Carregando: ${file.key}.${file.type} (${progress * 100}%)`);
    }

    function handleProgressBar(progress) {
      textProgress.setText(`${progress * 100}%`);
    }

    return loadingContainer;
  }

  loadImages() {
    this.load.image("vaso", new URL("./images/vaso-grego-antigo.png?quality=75&width=75", import.meta.url).pathname);
    this.load.image("mesa", new URL("./images/desk-sprite.png?quality=75&width=300", import.meta.url).pathname);
    this.load.image("raindrop", new URL("./images/raindrop-2d-sprite.png?quality=75&width=8", import.meta.url).pathname);
  }
  
  createRainHitArea(rainSource) {
    let widthOfRainHitArea = Phaser.Geom.Line.Length(rainSource);
    let heightOfRainHitArea = this.game.config.height - rainSource.y1;
    let rainHitArea = this.add.rectangle(rainSource.x1 + widthOfRainHitArea / 2, rainSource.y1 + heightOfRainHitArea / 2, widthOfRainHitArea, heightOfRainHitArea);
    return rainHitArea;
  }

  checkOrientation = (orientation) => {
    if(!this.orientationText) {
      this.orientationText = this.add.text(this.game.config.width/2, 20, "").setOrigin(0.5);
    }

    if (orientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      this.orientationText.setText("Vire o seu celular na Horizontal");
    } else if (orientation === Phaser.Scale.LANDSCAPE) {
      console.log("LANDSCAPE");
      this.orientationText.setText("");
    }
  }

  repositionVase = (item, mesa) => {
    if(item.state == "dragend") {
      item.setPosition(item.x, mesa.body.center.y - mesa.body.height/2 - item.body.height/2);
    }
  }

  damageItem = (item, areaDeEfeito) => {
    if(item.getData("health") > 0) {
      const currentColor = Phaser.Display.Color.ValueToColor("#ffffff");
      const finalColor = Phaser.Display.Color.ValueToColor("#ff0000");

      if(!item.isTinted) {
        item.setTint("#ffffff");
      }

      item.incData("health", -0.1);

      const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(currentColor, finalColor, 100, 100 - item.getData("health"));
      const colorNumber = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b);

      item.setTint(colorNumber);
    }
  }
}