import Phaser from "phaser"

export default class ShowInstrucoes extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.scene.add.existing(this)

    const textStyle = { 
      fontFamily: "Nunito-Regular", 
      fontSize: "30px",
      wordWrap: {
        width: 400
      }
    }

    if (window.localStorage.getItem("isMobile") === "true") {
      this.instrucoes = this.scene.add.image(-200, 0, "common-atlas", "mobile-instrucoes")
      this.txtInstrucoes = this.scene.add.text(-50, -30, "Pressione com o dedo e arraste para jogar", textStyle).setOrigin(0, 0.5)
    } else {
      this.instrucoes = this.scene.add.image(-150, 0, "common-atlas", "desktop-instrucoes")
      this.txtInstrucoes = this.scene.add.text(0, 0, "Pressione com o dedo e arraste para jogar", textStyle).setOrigin(0, 0.5)
    }

    this.add([this.instrucoes, this.txtInstrucoes])
  }
}