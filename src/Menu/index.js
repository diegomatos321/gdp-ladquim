import Phaser from "phaser"
import CONSTANTS from "../constants.json"

import fullScreenBtnComponent from "../components/fullScreenBtn"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    this.load.image("menu-fundo", new URL("./images/menu-fundo.png", import.meta.url).pathname);
    this.load.image("menu-botao", new URL("./images/menu-botao.png", import.meta.url).pathname);
    this.load.image("menu-botao-hover", new URL("./images/menu-botao-hover.png", import.meta.url).pathname);
    this.load.image("menu-logo", new URL("./images/menu-logo_old.png", import.meta.url).pathname);
    this.load.image("menu-title", new URL("./images/menu-title.png", import.meta.url).pathname);

    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.spritesheet("fullscreen-icon", new URL("../ui/fullscreen.png", import.meta.url).pathname, {      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-fundo");
    this.add.image(40, 50, "menu-logo").setOrigin(0, 0);

    const label = ["O Projeto", "Leaderboard", "Créditos", "Configurações"]
    const initX = 1440, initY = 400, stepY = 150;
    for (let index = 0; index < 4; index++) {
      const botao = this.add.image(initX + (350/2), (400 + 97/2) + (index * stepY), "menu-botao");
      this.add.text(botao.x, botao.y, label[index], {fontSize: "34px"}).setOrigin(0.5, 0.5);
    }
    
    this.ladquimArea = this.createLadquimMap();
    fullScreenBtnComponent(this);
  }
  
  createLadquimMap() {
    let ladquimArea = this.add.dom(this.game.config.width / 2, this.game.config.height / 2).createFromCache("ladquim-mapa");
    ladquimArea.addListener(Phaser.Input.Events.POINTER_UP);
    ladquimArea.on(Phaser.Input.Events.POINTER_UP, this.changeScene);

    return ladquimArea;
  }
  
  changeScene = (event) => {
    event.preventDefault();
  
    this.scene.start(CONSTANTS[event.target.id]);
  }
}