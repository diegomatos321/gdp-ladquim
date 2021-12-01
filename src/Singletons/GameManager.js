import Phaser from "phaser"
import CONSTANTS from "../constants.json"

export default class GameManager extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.GAME_MANAGER});
  }
  
  create() {
    this.currentSceneKey = "";
    this.scene.bringToTop()
    
    this.CheckOrientation();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  CheckOrientation = () => {
    const textStyle = {
      fontFamily: "Nunito-Black", 
      fontSize: "43px", 
      backgroundColor: "#ad1403", 
      padding: 30
    }
    this.orientationText = this.add.text(this.game.config.width/2, 60, "Vire o seu celular na Horizontal", textStyle).setOrigin(0.5).setVisible(false);

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

  setCurrentScene = (currentSceneKey) => {
    this.currentSceneKey = currentSceneKey;
  }

  cleanEvents = () => {
    this.events.removeListener(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }
}