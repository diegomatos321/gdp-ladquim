import Phaser from "phaser";
import CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import SliderButton from "../scripts/SliderButton";
import FullScreenBtn from "../scripts/fullScreenBtn";
import ShowInstrucoes from "../scripts/ShowInstrucoes";

export default class ConfiguracoesContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.fundo = this.scene.add.image(0, 0, "common-atlas", "modal-fundo")
    this.add(this.fundo)

    this.backArrow = this.scene.add.image(-this.fundo.width/2 + 100, -this.fundo.height/2 + 90, "ui-atlas", "back-arrow").setInteractive();
    this.backArrow.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    this.add(this.backArrow)

    this.fullScreenBtn = new FullScreenBtn(this.scene, this.fundo.width/2 - 120, -this.fundo.height/2 + 90).setOrigin(0.5)
    this.add(this.fullScreenBtn)

    this.musicSlider = new SliderButton(this.scene, 0, -160, "Música")
    this.add(this.musicSlider)
    this.musicSlider.on(CONSTANTS.VALUE_CHANGED, this.handleMusicValueChanged)
    
    this.Sons = new SliderButton(this.scene, 0, -20, "Sons");
    this.Sons.on(CONSTANTS.VALUE_CHANGED, this.handleSonsChanged)
    this.add(this.Sons)

    this.instrucoes = new ShowInstrucoes(this.scene, 0, 200);
    this.add(this.instrucoes)

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleBackArrow = () => {
    this.emit(CONSTANTS.BACK_ARROW_CLICKED)
  }

  handleMusicValueChanged = (value) => {
    console.log("Musica Changed: " + value)
  }

  handleSonsChanged = (value) => {
    console.log("Sons Changed: " + value)
  }

  cleanEvents = () => {
    console.log("Cleaning Events from Configurações")
    this.backArrow.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
  }
}