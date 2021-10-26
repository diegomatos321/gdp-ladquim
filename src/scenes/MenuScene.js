import Phaser from "phaser"
import CONSTANTS from "../constants.json"

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.MAIN_MENU});
  }

  preload() {
    this.load.html("ladquim-mapa", new URL("../DOMElements/mapa-laquim.html", import.meta.url).pathname);
    this.load.spritesheet("fullscreen-icon", new URL("../images/fullscreen-icon.png", import.meta.url).pathname, {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    this.add.text(this.game.config.width/2, 20, "Menu Principal").setOrigin(0.5, 0.5);
    
    this.ladquimArea = this.add.dom(this.game.config.width/2, this.game.config.height/2).createFromCache("ladquim-mapa");
    this.ladquimArea.addListener("click");
    this.ladquimArea.on("click", this.changeScene);

    this.fullscreenBtn = this.add.sprite(this.game.config.width - 16, 16, "fullscreen-icon", 0).setOrigin(1, 0).setInteractive();
    this.fullscreenBtn.on(Phaser.Input.Events.POINTER_UP, this.handleFullScreenMode);
  }

  changeScene = (event) => {
    event.preventDefault();

    this.scene.start(CONSTANTS[event.target.id]);
  }

  handleFullScreenMode = () => {
    if (this.scale.isFullscreen) {
      this.fullscreenBtn.setFrame(0);
      this.scale.stopFullscreen();
    } else {
      this.fullscreenBtn.setFrame(1);
      this.scale.startFullscreen();
    }
  }
}