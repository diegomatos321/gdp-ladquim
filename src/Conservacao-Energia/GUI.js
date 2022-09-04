import Phaser from "phaser"
import GameTimer from "./GameObjects/GameTimer"
import GAME_CONSTANTS from "./GAME_CONSTANTS.json"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import crossSceneEventEmitter from "../Singletons/CrossSceneEventEmitter"
import GAME_OBJECT_CONSTANTS from './GAME_OBJECT_CONSTANTS.json';
import InventorySlot from "./GameObjects/InventorySlot"

export default class QuimicaConservacaoGUI extends Phaser.Scene {
    usablesList = [
        'espanador',
        'limpeza',
        'lixo',
        'verniz'
    ]
    slotsGroup;

  constructor() {
    super({key: GAME_CONSTANTS.GUI})
  }
  
  init = () => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER)
  }

  create = () => {
    this.scene.moveAbove(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
    this.gameScene = this.scene.get(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)

    this.settingsButton = this.add.image(this.game.config.width - 16, 16, "ui-atlas", "options").setOrigin(1, 0).setInteractive();
    
    this.gameTimer = new GameTimer(this, this.GAME_WIDTH / 2, 100)
    this.drawInventory();
    
    this.settingsButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleSettingsClicked)
    crossSceneEventEmitter.on(GLOBAL_CONSTANTS.PAUSED, this.toogleSettingsButton);
    this.gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanAndStop);
  }

  handleSettingsClicked = () => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PAUSED)
  }

  toogleSettingsButton = () => {
    this.settingsButton.visible ? this.settingsButton.setVisible(false) : this.settingsButton.setVisible(true)
  }

  drawInventory = () => {
    this.slotsGroup = this.add.group();

    this.usablesList.forEach((usableName, i) => {
        const usableSlot = new InventorySlot(this, 250 + i*280, this.GAME_HEIGHT - 130, usableName);
        this.slotsGroup.add(usableSlot);
    });
  }

  cleanAndStop = () => {
    this.settingsButton.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleSettingsClicked)
    this.GameManager.events.removeListener(GLOBAL_CONSTANTS.PAUSED, this.toogleSettingsButton);
    this.gameScene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanAndStop);
    this.scene.stop();
  }
}