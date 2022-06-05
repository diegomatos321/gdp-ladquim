import Phaser from "phaser"
import PauseMiniGame from "../common/scripts/PauseMiniGame"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import crossSceneEventEmitter from "./CrossSceneEventEmitter";

export default class GameManager extends Phaser.Scene {
  constructor() {
    super({key: GLOBAL_CONSTANTS.GAME_MANAGER});
    this.currentSceneKey = null;
  }
  
  create() {
    this.scene.bringToTop()
    
    this.PauseMiniGame = new PauseMiniGame(this, 0, 0);

    // Verifica a orientação do dispositivo no início do Jogo
    this.handleChangeOrientation(this.scale.orientation);

    this.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
    crossSceneEventEmitter.on(GLOBAL_CONSTANTS.SHOW_ERROR_MESSAGE, this.showErrorMessage)
  }

  handleChangeOrientation = (scaleOrientation) => {
    if (scaleOrientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      this.showWarningMessage("Vire o celular na Horizontal");
    }
  }

  setCurrentScene = (currentSceneKey) => {
    this.currentSceneKey = currentSceneKey;
  }

  showWarningMessage = (message) => {
    const textStyle = {
      fontFamily: "Nunito", 
      fontStyle: "bold",
      fontSize: "43px", 
      backgroundColor: "#ffc60a", 
      padding: 30
    };

    let tempWarningMessage = this.add.text(this.game.config.width/2, 60, message, textStyle).setOrigin(0.5);

    this.warningTween = this.tweens.add({
      targets: tempWarningMessage,
      alpha: {
        from: 1,
        to: 0
      },
      duration: 10_000,
      ease: Phaser.Math.Easing.Cubic.InOut,
      onComplete: (tween, targets, param) => {
        targets.forEach((target) => target.destroy);
      }
    })
  }

  showErrorMessage = (message) => {
    const textStyle = {
      fontFamily: "Nunito", 
      fontStyle: "bold",
      fontSize: "43px", 
      backgroundColor: "#ad1403", 
      padding: 30
    };

    let tempErrorMessage = this.add.text(this.game.config.width/2, 60, message, textStyle).setOrigin(0.5);

    this.errorTween = this.tweens.add({
      targets: tempErrorMessage,
      alpha: {
        from: 1,
        to: 0
      },
      duration: 10_000,
      ease: Phaser.Math.Easing.Cubic.InOut,
      onComplete: (tween, targets, param) => {
        targets.forEach((target) => target.destroy);
      }
    })
  }

  cleanEvents = () => {
    this.scale.removeListener(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }
}