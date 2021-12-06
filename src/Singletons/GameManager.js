import Phaser from "phaser"
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
    
    this.CheckOrientation();
    this.HandlePauseLogic();
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  CheckOrientation = () => {
    const textStyle = {
      fontFamily: "Nunito-Black", 
      fontSize: "43px", 
      backgroundColor: "#ad1403", 
      padding: 30
    }
    this.orientationText = this.add.text(this.game.config.width/2, 60, "Vire o seu celular na Horizontal", textStyle).setOrigin(0.5).setVisible(false);

    this.handleChangeOrientation(this.scale.orientation);
    this.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }

  handleChangeOrientation = (scaleOrientation) => {
    if (scaleOrientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      this.orientationText.setVisible(true);
    } else if (scaleOrientation === Phaser.Scale.LANDSCAPE) {
      console.log("LANDSCAPE");
      this.orientationText.setVisible(false);
    }
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