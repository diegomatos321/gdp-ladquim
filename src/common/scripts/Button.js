import MODAL_CONSTANTS from "../../Menu/MODAL_CONSTANTS.json"

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, textConfig) {
    super(scene, x, y);

    this.name = text
    this.scene.add.existing(this)
    this.textura = this.scene.add.image(0, 0, "common-atlas", "botao-normal")
    this.add(this.textura)
    
    const buttonText = this.scene.add.text(0, 0, text, textConfig).setOrigin(0.5);
    this.add(buttonText)
    
    this.setInteractive(new Phaser.Geom.Rectangle(-this.textura.displayWidth/2, -this.textura.displayHeight/2, this.textura.displayWidth, this.textura.displayHeight), Phaser.Geom.Rectangle.Contains);
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.hoverButton)
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.normalButton)
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.downButton)
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.upButton)
    // this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
    this.on(Phaser.GameObjects.Events.DESTROY, this.cleanEvents)
  }

  hoverButton = () => {
    this.textura.setTexture("common-atlas", "botao-hover")
  }

  normalButton = () => {
    this.textura.setTexture("common-atlas", "botao-normal")
  }

  downButton = () => {
    console.log("GAMEOBJECT_POINTER_DOWN")
    this.textura.setTexture("common-atlas", "botao-down")
    if(this.name == MODAL_CONSTANTS.O_PROJETO) {
      window.open("https://ladquim.iq.ufrj.br", '_blank')
    }
  }

  upButton = () => {
    console.log("GAMEOBJECT_POINTER_UP")
    this.textura.setTexture("common-atlas", "botao-hover")
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from Button")
    this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.hoverButton)
    this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.normalButton)
    this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.downButton)
    this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.upButton)
  }
}