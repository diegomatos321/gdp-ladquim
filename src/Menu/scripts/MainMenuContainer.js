import Phaser from "phaser";
import Button from "../../common/scripts/Button"
import MODAL_CONSTANTS from "../MODAL_CONSTANTS.json"
import CONSTANTS from "../../constants.json"

export default class MainMenuContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);

    this.containerBotoes = this.createButtons()
    this.add(this.containerBotoes)

    this.ladquimTitle = this.scene.add.image(this.containerBotoes.x, 215, "menu-atlas", "ladquim-title")
    this.add(this.ladquimTitle)

    this.ladquimArea = this.createLadquimMap(1300, 550)
    this.bottomMapText = this.scene.add.text(this.ladquimArea.x, this.ladquimArea.y + this.ladquimArea.height / 2 + 43, "Selecione um Mini-Jogo!", { fontFamily: "Nunito-Black", fontSize: "43px" }).setOrigin(0.5, 0.5)
    this.add([this.ladquimArea, this.bottomMapText])

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  createButtons = () => {
    const labels = [MODAL_CONSTANTS.O_PROJETO, MODAL_CONSTANTS.LEADERBOARD, MODAL_CONSTANTS.CREDITOS], stepY = 150
    const buttonStyle = { fontFamily: "Nunito-Black", fontSize: "43px" }
    const containerBotoes = this.scene.add.container(520, 450)

    for (let index = 0; index < labels.length; index++) {
      const botao = new Button(this.scene, 0, index * stepY, labels[index], buttonStyle, labels[index])

      containerBotoes.add(botao)
    }

    const configuracoesBtn = new Button(this.scene, 0, 3 * stepY, "Configurações", buttonStyle);
    configuracoesBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      this.scene.events.emit(CONSTANTS.SHOW_MODAL, MODAL_CONSTANTS.CONFIGURACOES);
    })
    containerBotoes.add(configuracoesBtn);

    return containerBotoes;
  }

  createLadquimMap = (x, y) => {
    let ladquimArea = this.scene.add.dom(x, y).createFromCache("ladquim-mapa");
    ladquimArea.addListener(Phaser.Input.Events.POINTER_UP);
    ladquimArea.on(Phaser.Input.Events.POINTER_UP, this.changeScene);

    return ladquimArea;
  }

  changeScene = (event) => {
    event.preventDefault();
  
    this.scene.scene.start(CONSTANTS[event.target.id]);
  }

  cleanEvents = (sys) => {
    console.log("Cleaning Events from Menu Container")

    this.ladquimArea.removeListener(Phaser.Input.Events.POINTER_UP, this.changeScene)
  }
}