import Phaser from "phaser";
import CONSTANTS from "../GLOBAL_CONSTANTS.json"

export default class FimMinigame extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.FIM_MINI_GAME_QUIMICA_CONSERVACAO});   
  }

  init = () => {
    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(CONSTANTS.FIM_MINI_GAME_QUIMICA_CONSERVACAO)
  }

  create = () => {
    this.add.image(this.game.config.width / 2, this.game.config.height / 2, "common-atlas", "modal-fundo")
  }
}