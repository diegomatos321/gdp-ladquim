import Phaser from "phaser"

export default class ShowInstrucoes extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.scene.add.existing(this)

    const textStyle = { 
      fontFamily: "Nunito", 
      fontStyle: "bold",
      fontSize: "35px",
      wordWrap: {
        width: 600
      }
    }

    this.txtInstrucoes = this.scene.add.text(0, 0, "Arte:\n• Fernanda Doti\n• Rayane Inocência\n\nProgramação:\n• David Albuquerque\n• Diego Matos\n\nRoteiro e Game Design:\n• André Alves\n\nMúsica e SFX:\n• Bruno Camenietzki\n\nOrientação:\n• Joaquim Fernando Silva", textStyle).setOrigin(0.5, 0.65)
    this.add([this.txtInstrucoes])
  }
}