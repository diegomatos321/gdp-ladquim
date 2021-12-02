import Phaser from "phaser"
import FullScreenButton from "../common/scripts/fullScreenBtn"
import GameTimer from "./prefabs/GameTimer"
import FinishGame from "../common/scripts/FinishGame"
import CONSTANTS from "../constants.json"

export default class QuimicaConservacaoGUI extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.QUIMICA_CONSERVACAO_GUI})
  }

  create = () => {
    this.scene.moveAbove(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)

    this.fullScreenButton = new FullScreenButton(this);
    this.gameTimer = new GameTimer(this, 240, 36)
  }

  update = () => {
    this.gameTimer.updateTimer()
    if (this.gameTimer.hasEnded) {
      this.gameScene = this.scene.get(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
      FinishGame.FinishToMainMenu(this.gameScene);
      this.scene.stop();
    }
  }
}