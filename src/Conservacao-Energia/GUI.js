import Phaser from "phaser"
import GameTimer from "./GameObjects/GameTimer"
import GAME_CONSTANTS from "./GAME_CONSTANTS.json"
import GLOBAL_CONSTANTS from "../GLOBAL_CONSTANTS.json"
import crossSceneEventEmitter from "../Singletons/CrossSceneEventEmitter"
import InventorySlot from "./GameObjects/InventorySlot"

export default class QuimicaConservacaoGUI extends Phaser.Scene {
    slotsGroup;

  constructor() {
    super({key: GAME_CONSTANTS.GUI})
  }
  
  init = (startInventoryData) => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER)
    this.drawInventory(startInventoryData);
  }

  create = () => {
    this.scene.moveAbove(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
    this.gameScene = this.scene.get(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)

    this.settingsButton = this.add.image(this.game.config.width - 16, 16, "ui-atlas", "options").setOrigin(1, 0).setInteractive();
    
    this.gameTimer = new GameTimer(this, this.GAME_WIDTH / 2, 100)
    
    crossSceneEventEmitter.on(GLOBAL_CONSTANTS.PAUSED, this.toogleSettingsButton);
    crossSceneEventEmitter.on(GAME_CONSTANTS.GUI_UPDATE_INVENTORY, this.updateInventory);

    this.settingsButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleSettingsClicked)
    this.gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanAndStop);
  }

  handleSettingsClicked = () => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PAUSED)
  }

  toogleSettingsButton = () => {
    this.settingsButton.visible ? this.settingsButton.setVisible(false) : this.settingsButton.setVisible(true)
  }

  drawInventory = (startInventoryData) => {
    this.slotsGroup = this.add.group();

    const paddingX = 30;
    const startX = (this.GAME_WIDTH / 2) - ((startInventoryData.length - 1)) * (InventorySlot.slotWidth / 2 + paddingX);
    const startY = this.GAME_HEIGHT - 130;
    startInventoryData.forEach((usable, i) => {
        const usableSlot = new InventorySlot(this, startX + i*(InventorySlot.slotWidth + paddingX), startY, usable.name, usable.amount);
        this.slotsGroup.add(usableSlot);
    });
  }

  updateInventory = (itemName, newValue) => {
    if (newValue < 0) return;
    const slotInventory = this.slotsGroup.getMatching("name", itemName)[0];
    slotInventory.setLabel(newValue);
  }

  cleanAndStop = () => {
    crossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.PAUSED, this.toogleSettingsButton);
    crossSceneEventEmitter.removeListener(GAME_CONSTANTS.GUI_UPDATE_INVENTORY, this.updateInventory);

    this.settingsButton.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleSettingsClicked)
    this.gameScene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanAndStop);

    this.scene.stop();
  }
}