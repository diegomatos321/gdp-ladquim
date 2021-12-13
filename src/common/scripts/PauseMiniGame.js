import Phaser from "phaser";
import ConfiguracoesContainer from "../modals/ConfiguracoesContainer";
import CONSTANTS from "../../constants.json"

export default class PauseMiniGameContainer extends Phaser.GameObjects.Container {
  constructor(GameManager, x, y) {
    super(GameManager, x, y);

    this.scene.add.existing(this);

    this.setData("Blacklist", new Map([
      [CONSTANTS.MAIN_MENU, "Menu Principal"],
      [CONSTANTS.INICIO_MINI_GAME_QUIMICA_CONSERVACAO, "Inicio Conservacao Energia"],
      [CONSTANTS.FIM_MINI_GAME_QUIMICA_CONSERVACAO, "Fim Conservacao Energia"]
    ]));
    
    // this.pauseImage = this.scene.add.image(0, 0, "pauseImage").setVisible(false);
    // this.add([this.pauseImage]);

    this.pauseModal = new ConfiguracoesContainer(this.scene).setVisible(false);
    this.add(this.pauseModal)
    
    this.scene.input.keyboard.on("keyup-" + "W", this.emitEvent);
    this.scene.events.on(CONSTANTS.PAUSED, this.pauseCurrentMiniGame);
    this.pauseModal.on(CONSTANTS.BACK_ARROW_CLICKED, this.emitEvent)
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  emitEvent = () => {
    this.scene.events.emit(CONSTANTS.PAUSED)
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

      this.pauseModal.setVisible(false);
    } else {
      currentMiniGameScene.scene.pause();
      if(currentGUIMiniGame != null) {
        currentGUIMiniGame.scene.pause();
      }

      this.pauseModal.setVisible(true);
    }
  }

  cleanEvents = (sys) => {
    console.log("Cleaning Events from PauseMiniGameContainer")
    sys.scene.input.keyboard.on("keyup-" + "W", this.pauseCurrentMiniGame)
  }
}