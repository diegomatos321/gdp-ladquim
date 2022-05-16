import Phaser from "phaser";
import ConfiguracoesContainer from "../modals/ConfiguracoesContainer";
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"

export default class PauseMiniGameContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.setData("Blacklist", new Map([
      [GLOBAL_CONSTANTS.MAIN_MENU, "Menu Principal"]
    ]));

    this.pauseModal = new ConfiguracoesContainer(this.scene, this.scene.game.config.width/2, this.scene.game.config.height/2).setVisible(false);
    
    this.scene.input.keyboard.on("keyup-" + "W", this.emitEvent);
    this.scene.events.on(GLOBAL_CONSTANTS.PAUSED, this.pauseCurrentMiniGame);
    this.pauseModal.on(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED, this.emitEvent)
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  emitEvent = () => {
    this.scene.events.emit(GLOBAL_CONSTANTS.PAUSED)
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

    sys.scene.input.keyboard.removeListener("keyup-" + "W", this.emitEvent);
    sys.scene.events.removeListener(GLOBAL_CONSTANTS.PAUSED, this.pauseCurrentMiniGame);
    sys.pauseModal.removeListener(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED, this.emitEvent)
    sys.scene.input.keyboard.removeListener("keyup-" + "W", this.pauseCurrentMiniGame)
    sys.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }
}