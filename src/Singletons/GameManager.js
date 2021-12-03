import Phaser from "phaser"
import CheckOrientation from "../common/scripts/CheckOrientation"
import CONSTANTS from "../constants.json"

export default class GameManager extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.GAME_MANAGER});
    this.currentSceneKey = null;
    this.mapOfScenesToNotPause = new Map([
      [CONSTANTS.MAIN_MENU, "Menu Principal"]
    ]);
  }
  
  create() {
    this.scene.bringToTop()
    
    new CheckOrientation(this, this.game.config.width/2, 60);
    this.HandlePauseLogic();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  HandlePauseLogic = () => {
    this.pauseImage = this.add.image(900, 500, "pauseImage").setVisible(false);
    this.input.keyboard.on("keyup-" + "W", this.pauseCurrentMiniGame)
  }

  pauseCurrentMiniGame = () => {
    if (this.currentSceneKey === null || this.mapOfScenesToNotPause.has(this.currentSceneKey)) return
    
    const currentMiniGameScene = this.scene.get(this.currentSceneKey);
    const currentGUIMiniGame = this.scene.get(this.currentSceneKey + "-gui")

    if(currentMiniGameScene.scene.isPaused()) {
      currentMiniGameScene.scene.resume();
      if(currentGUIMiniGame != null) {
        currentGUIMiniGame.scene.resume();
      }

      this.pauseImage.setVisible(false);
    } else {
      currentMiniGameScene.scene.pause();
      if(currentGUIMiniGame != null) {
        currentGUIMiniGame.scene.pause();
      }

      this.pauseImage.setVisible(true);
    }
  }

  isDontPauseScene = () => {
    return this.ListOfScenesDontPause.find((sceneKey) => {
      return sceneKey === this.currentSceneKey
    })
  }

  setCurrentScene = (currentSceneKey) => {
    this.currentSceneKey = currentSceneKey;
  }

  cleanEvents = (sys) => {
    sys.scene.events.removeListener(Phaser.Scale.Events.ORIENTATION_CHANGE, sys.scene.handleChangeOrientation);
    sys.scene.input.keyboard.on("keyup-" + "W", sys.scene.pauseCurrentMiniGame)
  }
}