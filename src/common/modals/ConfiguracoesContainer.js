import Phaser from "phaser";
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import SliderButton from "../scripts/SliderButton";
import FullScreenBtn from "../scripts/fullScreenBtn";
import ShowInstrucoes from "../scripts/ShowInstrucoes";
import CrossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";

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

    /**
     * Aqui nos deparamos com uma limitação do Phaser 3, de acordo com a documentação:
     * 
     * "Containers can have masks set on them and can be used as a mask too. However, Container 
     * children cannot be masked. The masks do not 'stack up'. Only a Container on the root of 
     * the display list will use its mask.""
     * 
     * Como os nossos slider buttons são um container que envolve toda funcionalidade deles, e eles
     * contem uma máscara interna para a parte alaranjada da seleção, eles não podem ser adicionados
     * como "filhos" desse container. Sendo assim, eu adiciono diretamente à cena e faço a posição relativa
     * manualmente.
     * 
     * Nota: Caso o modal for mudar de posição/se mover, deve-se atualizar os slider buttons também.
     */
    this.musicSlider = new SliderButton(this.scene, this.x, this.y - 160, "Música").setVisible(this.visible)
    this.musicSlider.on(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleMusicVolume)
    CrossSceneEventEmitter.on(GLOBAL_CONSTANTS.RESPONSE_GET_MUSIC_SETTINGS, this.setMusicSliderValue) 
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS) // Get music setting from Audio Manager
    
    this.Sons = new SliderButton(this.scene, this.x, this.y - 20, "Sons").setVisible(this.visible);
    this.Sons.on(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleSonsChanged)
    // this.Sons.emit(GLOBAL_CONSTANTS.VALUE_CHANGED, this.Sons.value) // Update music Volume on start

    this.instrucoes = new ShowInstrucoes(this.scene, 0, 200);
    this.add(this.instrucoes)

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleBackArrow = () => {
    this.emit(GLOBAL_CONSTANTS.BACK_ARROW_CLICKED)
  }

  handleMusicVolume = (value) => {
    console.log("Musica Changed: " + value)
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.MUSIC_SETTINGS_CHANGED, "volume", value)
  }

  handleSonsChanged = (value) => {
    console.log("Sons Changed: " + value)
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.AUDIO_SETTINGS_CHANGED, "volume", value)
  }

  setMusicSliderValue = ({volume}) => {
    console.log("Response from Audio Manager: " + volume)
    if(volume === null || volume === undefined) return

    this.musicSlider.setValue(volume)
  }

  // Adicionando funcionalidade ao setVisible, para atuar tbm nos nossos slider buttons
  setVisible = (value) => {
    super.setVisible(value);

    this.musicSlider.setVisible(value)
    CrossSceneEventEmitter.emit(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS)
    this.Sons.setVisible(value);

    return this;
  }
  
  cleanEvents = () => {
    console.log("Cleaning Events from Configurações")
    
    this.backArrow.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    this.musicSlider.removeListener(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleMusicVolume)
    CrossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS, this.setMusicSliderValue)
    this.Sons.removeListener(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleSonsChanged)
  }
}