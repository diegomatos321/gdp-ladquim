export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, textConfig) {
    super(scene, x, y);

    this.scene.add.existing(this)
    this.textura = this.scene.add.image(0, 0, "menu-atlas", "menu-botao")
    this.add(textura)
    
    const buttonText = this.scene.add.text(0, 0, text, textConfig).setOrigin(0.5);
    this.add(buttonText)
    
    this.setInteractive(new Phaser.Geom.Rectangle(-textura.displayWidth/2, -textura.displayHeight/2, textura.displayWidth, textura.displayHeight), Phaser.Geom.Rectangle.Contains);
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.hoverButton)
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.normalButton)
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.downButton)
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.upButton)
  }

  hoverButton = () => {
    this.textura.setTexture("menu-atlas", "menu-botao-hover")
  }

  normalButton = () => {
    textura.setTexture("menu-atlas", "menu-botao")
  }

  downButton = () => {
    console.log("GAMEOBJECT_POINTER_DOWN")
  }

  upButton = () => {
    console.log("GAMEOBJECT_POINTER_UP")
  }
}