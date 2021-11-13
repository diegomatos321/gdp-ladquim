import Phaser from "phaser"
import CONSTANTS from "../constants.json"
import menuAtlas from "./images/menu_atlas.json"

import Button from "../common/scripts/Button"
import fullScreenBtnComponent from "../common/scripts/fullScreenBtn"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    this.load.atlas("menu-atlas", new URL("./images/menu.png", import.meta.url).pathname, menuAtlas);

    this.load.html("ladquim-mapa", new URL("./DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.image("fullscreen-icon", new URL("../common/ui/fullscreen.png", import.meta.url).pathname);
  }

  create() {
    this.add.image(this.game.config.width/2, this.game.config.height/2, "menu-atlas", "menu-fundo");
    this.add.image(40, 50, "menu-atlas", "menu-logo_old").setOrigin(0, 0);

    const label = ["O Projeto", "Leaderboard", "Créditos", "Configurações"], stepY = 150;
    const containerBotoes = this.add.container(1600, 400)
    for (let index = 0; index < 4; index++) {
      const botao = new Button(this, 0, index * stepY, label[index], {fontFamily: "Nunito-Black", fontSize: "43px", })
      containerBotoes.add(botao)
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