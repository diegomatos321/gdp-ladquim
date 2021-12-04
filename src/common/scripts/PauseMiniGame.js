import Phaser from "phaser";
import CONSTANTS from "../../constants.json"

export default class PauseMiniGameContainer extends Phaser.GameObjects.Container {
  constructor(GameManager, x, y) {
    super(GameManager, x, y);

    this.scene.add.existing(this);

    this.setData("Blacklist", new Map([
      [CONSTANTS.MAIN_MENU, "Menu Principal"]
    ]));
    
    this.pauseImage = this.scene.add.image(0, 0, "pauseImage").setVisible(false);
    this.add([this.pauseImage]);

    this.scene.input.keyboard.on("keyup-" + "W", this.pauseCurrentMiniGame);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  pauseCurrentMiniGame = () => {
    if (this.scene.currentSceneKey === null || this.getData("Blacklist").has(this.scene.currentSceneKey)) return
    
    const currentMiniGameScene = this.scene.scene.get(this.scene.currentSceneKey);
    const currentGUIMiniGame = this.scene.scene.get(this.scene.currentSceneKey + "-gui")

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

  cleanEvents = (sys) => {
    console.log("Cleaning Events from PauseMiniGameContainer")
    sys.scene.input.keyboard.on("keyup-" + "W", this.pauseCurrentMiniGame)
  }
}