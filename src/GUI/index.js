import Phaser from "phaser"
import FullScreenBtn from "../common/scripts/fullScreenBtn";
import CONSTANTS from "../constants.json"

export default class GUI extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.GUI});
  }
  
  create() {
    this.scene.bringToTop()
    this.fullScreenBtn = new FullScreenBtn(this)
    
    this.CheckOrientation();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  CheckOrientation = () => {
    this.orientationText = this.add.text(this.game.config.width/2, 50, "Vire o seu celular na Horizontal", {fontFamily: "Nunito-Black", fontSize: "43px", }).setOrigin(0.5).setVisible(false);

    this.handleChangeOrientation(this.scale.orientation);

    this.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }

  handleChangeOrientation = (scaleOrientation) => {
    if (scaleOrientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      this.orientationText.setVisible(true);
    } else if (scaleOrientation === Phaser.Scale.LANDSCAPE) {
      console.log("LANDSCAPE");
      this.orientationText.setVisible(false);
    }
  }

  cleanEvents = () => {
    this.events.removeListener(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }
}