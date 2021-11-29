import Phaser from "phaser"
import CONSTANTS from "../constants.json"
import menuAtlas from "./atlas/menu-textures.json"
import Button from "../common/scripts/Button"
import LoadingInterface from "../common/scripts/LoadingInterface"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    new LoadingInterface(this, this.game.config.width/2, this.game.config.height/2)
    this.load.atlas("menu-atlas", new URL("./atlas/menu-textures.png", import.meta.url).pathname, menuAtlas);
    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
  }

  create() {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-atlas", "fundo");
    this.add.image(40, 50, "menu-atlas", "ladquim-logo").setOrigin(0, 0);

    const label = ["O Projeto", "Leaderboard", "Créditos", "Configurações"], stepY = 150;
    const containerBotoes = this.add.container(520, 450)
    for (let index = 0; index < 4; index++) {
      const botao = new Button(this, 0, index * stepY, label[index], {fontFamily: "Nunito-Black", fontSize: "43px", })
      containerBotoes.add(botao)
    }

    this.add.image(containerBotoes.x, 215, "menu-atlas", "ladquim-title");
    
    this.ladquimArea = this.createLadquimMap(1300, 550);
    this.add.text(this.ladquimArea.x, this.ladquimArea.y + this.ladquimArea.displayHeight/2 + 200, "Selecione um Mini-Jogo!", {fontFamily: "Nunito-Black", fontSize: "43px"}).setOrigin(0.5, 0.5);
  }
  
  createLadquimMap(x, y) {
    let ladquimArea = this.add.dom(x, y).createFromCache("ladquim-mapa");
    ladquimArea.addListener(Phaser.Input.Events.POINTER_UP);
    ladquimArea.on(Phaser.Input.Events.POINTER_UP, this.changeScene);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)

    return ladquimArea;
  }
  
  changeScene = (event) => {
    event.preventDefault();
  
    this.scene.start(CONSTANTS[event.target.id]);
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from: Menu")
    sys.scene.ladquimArea.removeListener(Phaser.Input.Events.POINTER_UP, this.changeScene)
  }
}