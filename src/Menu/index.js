import Phaser from "phaser"
import CONSTANTS from "../constants.json"
import menuAtlas from "./images/menu_atlas.json"

import fullScreenBtnComponent from "../components/fullScreenBtn"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    this.load.atlas("menu-atlas", new URL("./images/menu.png", import.meta.url).pathname, menuAtlas);

    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.image("fullscreen-icon", new URL("../ui/fullscreen.png", import.meta.url).pathname);
  }

  create() {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-atlas", "menu-fundo");
    this.add.image(40, 50, "menu-atlas", "menu-logo_old").setOrigin(0, 0);

    const label = ["O Projeto", "Leaderboard", "Créditos", "Configurações"]
    const initX = 1440, initY = 400, stepY = 150;
    for (let index = 0; index < 4; index++) {
      const botao = this.add.image(initX + (350/2), (initY + 97/2) + (index * stepY), "menu-atlas", "menu-botao").setInteractive();
      botao.on(Phaser.Input.Events.POINTER_OVER, () => botao.setTexture("menu-atlas", "menu-botao-hover"))
      botao.on(Phaser.Input.Events.POINTER_OUT, () => botao.setTexture("menu-atlas", "menu-botao"))

      this.add.text(botao.x, botao.y, label[index], {fontFamily: "Nunito-ExtraBold", fontSize: "43px"}).setOrigin(0.5, 0.5);
    }

    this.add.image(683, 197, "menu-atlas", "menu-title");
    
    this.ladquimArea = this.createLadquimMap(683, 699);
    this.add.text(this.ladquimArea.x, 1030, "Selecione um Mini-Jogo!", {fontFamily: "Nunito-Black", fontSize: "43px"}).setOrigin(0.5, 0.5);
    new fullScreenBtnComponent(this);
  }
  
  createLadquimMap(x, y) {
    let ladquimArea = this.add.dom(x, y).createFromCache("ladquim-mapa");
    ladquimArea.addListener(Phaser.Input.Events.POINTER_UP);
    ladquimArea.on(Phaser.Input.Events.POINTER_UP, this.changeScene);

    return ladquimArea;
  }
  
  changeScene = (event) => {
    event.preventDefault();
  
    this.scene.start(CONSTANTS[event.target.id]);
  }
}