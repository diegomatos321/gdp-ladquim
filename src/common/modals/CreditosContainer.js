import Phaser from "phaser";
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import ShowCreditos from "../scripts/ShowCreditos";
import CrossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";

export default class CreditosContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.fundo = this.scene.add.image(0, 0, "common-atlas", "modal-fundo")
    this.add(this.fundo)

    this.backArrow = this.scene.add.image(-this.fundo.width/2 + 100, -this.fundo.height/2 + 90, "ui-atlas", "back-arrow").setInteractive();
    this.add(this.backArrow)

    this.instrucoes = new ShowCreditos(this.scene, 0, 100);
    this.add(this.instrucoes)
    
    this.backArrow.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleBackArrow = () => {
    this.emit(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED)
  }


  // Adicionando funcionalidade ao setVisible, para atuar tbm nos nossos slider buttons
  setVisible = (value) => {
    super.setVisible(value);
    return this;
  }
  
  cleanEvents = (sys) => {
    console.log("Cleaning Events from Créditos")
    
    this.backArrow.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.RESPONSE_GET_MUSIC_SETTINGS, this.setMusicSliderValue)
    sys.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }
}