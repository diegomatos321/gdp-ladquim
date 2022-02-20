import Phaser from "phaser";
import Button from "../../common/scripts/Button";
import ShowInstrucoes from "../../common/scripts/ShowInstrucoes";
import GAME_CONSTANTS from "../GAME_CONSTANTS.json"
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json"

export default class StartGameModal extends Phaser.Scene {
  constructor() {
    super({key: GAME_CONSTANTS.START_GAME_MODAL});   
  }

  init = () => {
    this.GameManager = this.scene.get(GLOBAL_CONSTANTS.GAME_MANAGER);
    this.GameManager.setCurrentScene(this.scene.key)
    
    this.gameScene = this.scene.get(GLOBAL_CONSTANTS.MINI_GAME_QUIMICA_CONSERVACAO);
  }

  create = () => {
    this.modalFundo = this.add.image(this.game.config.width/2, this.game.config.height/2, "common-atlas", "modal-fundo");

    const titleStyle = {
      fontSize: 50,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
      align: "center",
      wordWrap: {
        width: this.modalFundo.width * 0.8
      }
    }
    this.txtTitle = this.add.text(this.game.config.width/2, this.modalFundo.getTopCenter().y + this.modalFundo.height/6, "Química e Conservação", titleStyle).setOrigin(0.5);

    this.instrucoes = new ShowInstrucoes(this, this.game.config.width/2, this.game.config.height/2);

    const commandStyle = {
      fontSize: 43,
      fontFamily: "Nunito",
      fontStyle: "normal 800",
    }
    this.voltarBtn = new Button(this, this.modalFundo.x - this.modalFundo.width/4, this.modalFundo.y + this.modalFundo.height/2 - 130, "Voltar", commandStyle)
    
    this.playBtn = new Button(this, this.modalFundo.x + this.modalFundo.width/4, this.voltarBtn.y, "Jogar", commandStyle)
       
    this.playBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlayBtn)
    this.voltarBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleVoltarBtn)
    this.gameScene.events.on(GAME_CONSTANTS.START_GAME, this.cleanAndStop)
    this.gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanAndStop)
  }

  handleVoltarBtn = () => {
    this.gameScene.events.emit(GAME_CONSTANTS.RETURN_TO_MENU);
  }

  handlePlayBtn = () => {
    this.gameScene.events.emit(GAME_CONSTANTS.START_GAME);
  }

  cleanAndStop = () => {
    console.log("Cleaning Events from Inicio Minigame")

    this.playBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlayBtn)
    this.voltarBtn.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleVoltarBtn)
    this.gameScene.events.removeListener(GAME_CONSTANTS.START_GAME, this.cleanAndStop)

    this.scene.stop();
  }
}