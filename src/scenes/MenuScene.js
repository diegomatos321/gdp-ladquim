import Phaser from "phaser"
import CONSTANTS from "../constants.json"

import fullScreenBtnComponent from "../components/fullScreenBtn.js"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    this.load.html("ladquim-mapa", new URL("../DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.spritesheet("fullscreen-icon", new URL("../ui/fullscreen-icon.png", import.meta.url).pathname, {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    this.add.text(this.game.config.width/2, 20, "Menu Principal").setOrigin(0.5, 0.5);
    
    this.ladquimArea = this.createLadquimMap();
    fullScreenBtnComponent(this);
  }
  
  createLadquimMap() {
    let ladquimArea = this.add.dom(this.game.config.width / 2, this.game.config.height / 2).createFromCache("ladquim-mapa");
    ladquimArea.addListener(Phaser.Input.Events.POINTER_DOWN);
    ladquimArea.on(Phaser.Input.Events.POINTER_DOWN, this.changeScene);

    return ladquimArea;
  }
  
  changeScene = (event) => {
    event.preventDefault();
  
    this.scene.start(CONSTANTS[event.target.id]);
  }
}