import Phaser from "phaser"
import CheckOrientation from "../common/scripts/CheckOrientation"
import PauseMiniGameContainer from "../common/scripts/PauseMiniGame"
import CONSTANTS from "../constants.json"

export default class GameManager extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.GAME_MANAGER});
    this.currentSceneKey = null;
  }
  
  create() {
    this.scene.bringToTop()
    
    this.checkOrientation = new CheckOrientation(this, this.game.config.width/2, 60);
    this.pauseMiniGameContainer = new PauseMiniGameContainer(this);
  }

  setCurrentScene = (currentSceneKey) => {
    this.currentSceneKey = currentSceneKey;
  }
}