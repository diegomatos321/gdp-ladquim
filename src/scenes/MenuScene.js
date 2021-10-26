import Phaser from "phaser"
import CONSTANTS from "../constants.json"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    this.load.html("ladquim-mapa", new URL("../DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.spritesheet("fullscreen-icon", new URL("../images/fullscreen-icon.png", import.meta.url.pathname));
  }

  create() {
    this.add.text(this.game.config.width/2, 20, "Menu Principal").setOrigin(0.5, 0.5);
    
    this.ladquimArea = this.add.dom(this.game.config.width/2, this.game.config.height/2).createFromCache("ladquim-mapa");
    this.ladquimArea.addListener("click");
    this.ladquimArea.on("click", this.changeScene);
  }

  changeScene = (event) => {
    event.preventDefault();
    console.dir(event)

    this.scene.start(CONSTANTS[event.target.id]);
  }
}