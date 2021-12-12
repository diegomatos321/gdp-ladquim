import Phaser from "phaser";
import Button from "../common/scripts/Button";
import CONSTANTS from "../constants.json"

export default class InicioMinigame extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.INICIO_MINI_GAME_QUIMICA_CONSERVACAO});   
  }

  init = () => {
    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(CONSTANTS.INICIO_MINI_GAME_QUIMICA_CONSERVACAO)
  }

  create = () => {
    this.modalContainer = this.add.container(this.game.config.width / 2, this.game.config.height / 2);

    this.modalFundo = this.add.image(0, 0, "common-atlas", "modal-fundo");

    const titleStyle = {
      fontSize: 50,
      fontFamily: "Nunito-Black",
      align: "center",
      wordWrap: {
        width: this.modalFundo.width/2
      }
    }
    this.txtTitle = this.add.text(0, this.modalFundo.getTopCenter().y + this.modalFundo.height/6, "Química e Conservação", titleStyle).setOrigin(0.5);

    this.mobileInstrucoes = this.add.image(-this.modalFundo.width/6, 0, "common-atlas", "mobile-instrucoes")

    const instrucoesStyle = {
      fontSize: 33,
      fontFamily: "Nunito-Black",
      padding: {
        left: 30
      },
      wordWrap: {
        width: this.modalFundo.width/2
      }
    }
    this.txtInstrucoes = this.add.text(this.mobileInstrucoes.x + this.mobileInstrucoes.width/2, this.mobileInstrucoes.y, "Pressione com o dedo e arraste para jogar", instrucoesStyle).setOrigin(0, 0.5)

    const commandStyle = {
      fontSize: 43,
      fontFamily: "Nunito-Black",
    }
    this.voltarBtn = new Button(this, -this.modalFundo.width/4, this.modalFundo.y + this.modalFundo.height/2 - 130, "Voltar", commandStyle)
    
    this.playBtn = new Button(this, this.modalFundo.width/4, this.voltarBtn.y, "Jogar", commandStyle)
    
    this.modalContainer.add([this.modalFundo, this.txtTitle, this.mobileInstrucoes, this.txtInstrucoes, this.voltarBtn, this.playBtn]);
    
    this.playBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlayBtn)
    this.voltarBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleVoltarBtn)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleVoltarBtn = () => {
    console.log("Voltar")
    this.scene.start(CONSTANTS.MAIN_MENU)
  }

  handlePlayBtn = () => {
    console.log("Jogar")
    this.scene.start(CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO)
  }

  cleanEvents = () => {
    console.log("Cleaning Events from Inicio Minigame")

    this.playBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlayBtn)
    this.voltarBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleVoltarBtn)

    const GameManager = this.scene.get(CONSTANTS.GAME_MANAGER);
    GameManager.setCurrentScene(null)
  }
}