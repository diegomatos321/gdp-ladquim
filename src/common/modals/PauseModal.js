import FullScreenBtn from "../scripts/fullScreenBtn";
import Button from "../scripts/Button"
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";

export default class PauseModal extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.fundo = this.scene.add.image(0, 0, "common-atlas", "modal-fundo")
    this.fullScreenBtn = new FullScreenBtn(this.scene, this.fundo.width/2 - 120, -this.fundo.height/2 + 90).setOrigin(0.5)

    const titleStyle = {
      fontSize: 50,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
      align: "center",
      wordWrap: {
        width: this.fundo.width * 0.8
      }
    }
    this.txtTitle = this.scene.add.text(0, -310, "Opções", titleStyle).setOrigin(0.5);

    const commandStyle = {
      fontSize: 43,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
    }
    this.quitBtn = new Button(this.scene, -200, 220, "Sair", commandStyle)
    this.resumeGame = new Button(this.scene, 200, 220, "Voltar ao Jogo", commandStyle)

    this.add([this.fundo, this.fullScreenBtn, this.txtTitle, this.quitBtn, this.resumeGame]);

    this.resumeGame.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    this.quitBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleQuitBtn)
  }

  handleBackArrow = () => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PAUSED)
  }

  handleQuitBtn = () => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.RETURN_TO_MENU)
    this.setVisible(false);
  }
}