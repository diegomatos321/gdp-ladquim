import Phaser from "phaser";
import CONSTANTS from "../../constants.json"
import MODAL_CONSTANTS from "../MODAL_CONSTANTS.json"
import SliderButton from "../../common/scripts/SliderButton";

export default class ConfiguracoesContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.fundo = this.scene.add.image(this.scene.game.config.width/2, this.scene.game.config.height/2, "menu-atlas", "configuracoes-fundo")
    this.add(this.fundo)

    this.backArrow = this.scene.add.image(630, 230, "ui-atlas", "back-arrow").setInteractive();
    this.backArrow.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.backToMenu)
    this.add(this.backArrow)

    this.musicSlider = new SliderButton(this.scene, this.scene.game.config.width/2, 350, "Música");
    this.musicSlider.on(CONSTANTS.VALUE_CHANGED, this.handleMusicValueChanged)
    this.add(this.musicSlider)
    
    this.Sons = new SliderButton(this.scene, this.scene.game.config.width/2, 480, "Sons");
    this.Sons.on(CONSTANTS.VALUE_CHANGED, this.handleSonsChanged)
    this.add(this.Sons)

    this.instrucoes = this.scene.add.image(this.scene.game.config.width/2 - 200, this.scene.game.config.height/2 + 200, "menu-atlas", "mobile-instrucoes")
    const textStyle = { 
      fontFamily: "Nunito-Regular", 
      fontSize: "30px",
      wordWrap: {
        width: 400
      }
    }
    this.txtInstrucoes = this.scene.add.text(this.instrucoes.x + 120, this.instrucoes.y - 30, "Pressione com o dedo e arraste para jogar", textStyle).setOrigin(0, 0.5)
    this.add([this.instrucoes, this.txtInstrucoes])

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  backToMenu = () => {
    this.scene.events.emit(CONSTANTS.SHOW_MODAL, MODAL_CONSTANTS.MENU)
  }

  handleMusicValueChanged = (value) => {
    console.log("Musica Changed: " + value)
  }

  handleSonsChanged = (value) => {
    console.log("Sons Changed: " + value)
  }

  cleanEvents = () => {
    console.log("Cleaning Events from Configurações")
    this.backArrow.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.backToMenu)
  }
}