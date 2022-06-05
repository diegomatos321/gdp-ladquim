import Phaser from "phaser";
import PauseModal from "../modals/PauseModal";
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";

export default class PauseMiniGame extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.setData("Blacklist", new Map([
      [GLOBAL_CONSTANTS.MAIN_MENU, "Menu Principal"]
    ]));

    this.pauseModal = new PauseModal(this.scene, 0, 0).setVisible(false);

    this.add(this.pauseModal);
    
    crossSceneEventEmitter.on(GLOBAL_CONSTANTS.PAUSED, this.pauseCurrentMiniGame);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  pauseCurrentMiniGame = () => {
    if (this.scene.currentSceneKey === null || this.getData("Blacklist").has(this.scene.currentSceneKey)) return
    
    const currentMiniGameScene = this.scene.scene.get(this.scene.currentSceneKey);

    if(currentMiniGameScene.scene.isPaused()) {
      currentMiniGameScene.scene.resume();
      this.pauseModal.setVisible(false);
    } else {
      currentMiniGameScene.scene.pause();
      this.pauseModal.setVisible(true);
    }
  }

  cleanEvents = (sys) => {
    console.log("Cleaning Events from PauseMiniGameContainer")

    sys.scene.events.removeListener(GLOBAL_CONSTANTS.PAUSED, this.pauseCurrentMiniGame);
    sys.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }
}