import Phaser from "phaser"
import ConfiguracoesContainer from "../common/modals/ConfiguracoesContainer"
import GameTimer from "./prefabs/GameTimer"
import FinishGame from "../common/scripts/FinishGame"
import CONSTANTS from "../constants.json"

export default class QuimicaConservacaoGUI extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.QUIMICA_CONSERVACAO_GUI})
  }

  create = () => {
    this.scene.moveAbove(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)

    this.settingsButton = this.add.image(this.game.config.width - 16, 16, "ui-atlas", "options").setOrigin(1, 0).setInteractive();
    
    this.gameTimer = new GameTimer(this, 240, 36)
    
    this.settingsButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleSettingsClicked)
    this.scene.get(CONSTANTS.GAME_MANAGER).events.on(CONSTANTS.PAUSED, this.toogleSettingsButton);
  }

  update = () => {
    this.gameTimer.updateTimer()
    if (this.gameTimer.hasEnded) {
      this.gameScene = this.scene.get(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
      FinishGame.FinishToMainMenu(this.gameScene);
      this.scene.stop();
    }
  }

  handleSettingsClicked = () => {
    this.scene.get(CONSTANTS.GAME_MANAGER).events.emit(CONSTANTS.PAUSED)
  }

  toogleSettingsButton = () => {
    this.settingsButton.visible ? this.settingsButton.setVisible(false) : this.settingsButton.setVisible(true)
  }
}