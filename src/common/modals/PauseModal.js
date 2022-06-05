import FullScreenBtn from "../scripts/fullScreenBtn";
import Button from "../scripts/Button"
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"
import SliderButton from "../scripts/SliderButton";
import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";

export default class PauseModal extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.fundo = this.scene.add.image(0, 0, "common-atlas", "modal-fundo")
    this.fullScreenBtn = new FullScreenBtn(this.scene, this.fundo.width / 2 - 120, -this.fundo.height / 2 + 90).setOrigin(0.5)

    const titleStyle = {
      fontSize: 50,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
      align: "center",
      wordWrap: {
        width: this.fundo.width * 0.8
      }
    }
    this.txtTitle = this.scene.add.text(0, -310, "Opções", titleStyle).setOrigin(0.5);

    const commandStyle = {
      fontSize: 43,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
    }
    this.quitBtn = new Button(this.scene, -200, 220, "Sair", commandStyle)
    this.resumeGame = new Button(this.scene, 200, 220, "Voltar ao Jogo", commandStyle)

    this.add([this.fundo, this.fullScreenBtn, this.txtTitle, this.quitBtn, this.resumeGame]);

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
    this.Sons = new SliderButton(this.scene, this.x, this.y - 20, "Sons").setVisible(this.visible);
    this.updateModalState();

    this.resumeGame.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    this.quitBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleQuitBtn)
    this.Sons.on(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleSonsChanged);
    this.musicSlider.on(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleMusicVolume);
    crossSceneEventEmitter.on(GLOBAL_CONSTANTS.RESPONSE_GET_MUSIC_SETTINGS, this.setMusicSliderValue)
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleBackArrow = () => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PAUSED)
  }

  handleQuitBtn = () => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.RETURN_TO_MENU)
    this.setVisible(false);
  }

  updateModalState = () => {
    // Update music Volume on start
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS)
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.GET_AUDIO_SETTINGS)
  }

  handleMusicVolume = (value) => {
    console.log("Musica Changed: " + value)
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.MUSIC_SETTINGS_CHANGED, "volume", value)
  }

  handleSonsChanged = (value) => {
    console.log("Sons Changed: " + value)
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.AUDIO_SETTINGS_CHANGED, "volume", value)
  }

  setMusicSliderValue = ({ volume }) => {
    console.log("Response from Audio Manager: " + volume)
    if (volume === null || volume === undefined) return

    this.musicSlider.setValue(volume)
  }

  // Adicionando funcionalidade ao setVisible, para atuar tbm nos nossos slider buttons
  setVisible = (value) => {
    super.setVisible(value);

    this.musicSlider.setVisible(value)
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.GET_MUSIC_SETTINGS)
    this.Sons.setVisible(value);
    this.fullScreenBtn.syncTextureWithFullscreenState();

    return this;
  }

  cleanEvents = () => {
    this.resumeGame.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleBackArrow)
    this.quitBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleQuitBtn)
    this.Sons.removeListener(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleSonsChanged);
    this.musicSlider.removeListener(GLOBAL_CONSTANTS.VALUE_CHANGED, this.handleMusicVolume);
    crossSceneEventEmitter.removeListener(GLOBAL_CONSTANTS.RESPONSE_GET_MUSIC_SETTINGS, this.setMusicSliderValue)
    this.scene.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }
}