import Phaser from "phaser"
import CheckOrientation from "../common/scripts/CheckOrientation"
import PauseMiniGameContainer from "../common/scripts/PauseMiniGame"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"

export default class GameManager extends Phaser.Scene {
  constructor() {
    super({key: GLOBAL_CONSTANTS.GAME_MANAGER});
    this.currentSceneKey = null;
  }
  
  create() {
    this.scene.bringToTop()
    
    this.pauseMiniGameContainer = new PauseMiniGameContainer(this, this.game.config.width/2, this.game.config.height/2);

    // Verifica a orientação do dispositivo no início do Jogo
    this.handleChangeOrientation(this.scene.scale.orientation);

    this.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
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
      fontFamily: "Nunito-Black", 
      fontSize: "43px", 
      backgroundColor: "#ad1403", 
      padding: 30
    };

    let tempWarningMessage = this.add.text(this.game.config.width/2, 60, message, textStyle);

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
        tween
      }
    })
  }

  showErrorMessage = () => {
    const textStyle = {
      fontFamily: "Nunito-Black", 
      fontSize: "43px", 
      backgroundColor: "#ad1403", 
      padding: 30
    };
  }

  cleanEvents = () => {
    this.scale.removeListener(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }
}