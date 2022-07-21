import Phaser from "phaser";
import GAME_CONSTANTS from "../GAME_CONSTANTS.json"
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import Button from "../../common/scripts/Button";
import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";

export default class FinishGameModal extends Phaser.Scene {
  constructor() {
    super({ key: GAME_CONSTANTS.FINISH_GAME_MODAL })
  }

  init = () => {
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(this.scene.key);

    this.gameScene = this.scene.get(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO);
  }

  create = () => {
    this.modalFundo = this.add.image(this.game.config.width/2, this.game.config.height/2, "common-atlas", "modal-fundo");

    const titleStyle = {
      fontSize: 50,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
      align: "center",
      wordWrap: {
        width: this.modalFundo.width * 0.8
      }
    }

    this.txtTitle = this.add.text(this.game.config.width/2, this.modalFundo.getTopCenter().y + this.modalFundo.height/6, "Fim de Jogo !", titleStyle).setOrigin(0.5);

    const commandStyle = {
      fontSize: 43,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
    }
    this.playAgainBtn = new Button(this, this.modalFundo.x, this.modalFundo.y - 70, "Jogar Novamente", commandStyle)
    this.sairBtn = new Button(this, this.modalFundo.x, this.modalFundo.y + 70, "Sair", commandStyle)

    this.playAgainBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlayAgainBtn)
    this.sairBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleSairBtn)
    this.gameScene.events.on(GAME_CONSTANTS.RESTART_GAME, this.shutdownModal)
    this.gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdownModal)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handlePlayAgainBtn = () => {
    this.gameScene.events.emit(GAME_CONSTANTS.RESTART_GAME);
  }

  handleSairBtn = () => {
    crossSceneEventEmitter.emit(GAME_CONSTANTS.RETURN_TO_MENU);
    this.shutdownModal();
  }

  shutdownModal = () => {
    this.scene.stop()
  }

  cleanEvents = () => {
    console.log("Cleaning Events from Fim Minigame")

    this.playAgainBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlayAgainBtn)
    this.sairBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleSairBtn)
    this.gameScene.events.removeListener(GAME_CONSTANTS.RESTART_GAME, this.shutdownModal)
    this.gameScene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.shutdownModal)
    this.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }
}