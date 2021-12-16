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
    
    this.checkOrientation = new CheckOrientation(this, this.game.config.width/2, 60);
    this.pauseMiniGameContainer = new PauseMiniGameContainer(this, this.game.config.width/2, this.game.config.height/2);
  }

  setCurrentScene = (currentSceneKey) => {
    this.currentSceneKey = currentSceneKey;
  }
}