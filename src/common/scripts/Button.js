export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, textConfig) {
    super(scene, x, y);

    scene.add.existing(this)
    let textura = scene.add.image(0, 0, "menu-atlas", "menu-botao")
    this.add(textura)
    
    const buttonText = scene.add.text(0, 0, text, textConfig).setOrigin(0.5);
    this.add(buttonText)
    
    this.setInteractive(new Phaser.Geom.Rectangle(-textura.displayWidth/2, -textura.displayHeight/2, textura.displayWidth, textura.displayHeight), Phaser.Geom.Rectangle.Contains);
    this.on(Phaser.Input.Events.POINTER_OVER, () => textura.setTexture("menu-atlas", "menu-botao-hover", [6, undefined, 6], [6, undefined, 6]))
    this.on(Phaser.Input.Events.POINTER_OUT, () => textura.setTexture("menu-atlas", "menu-botao", [6, undefined, 6], [6, undefined, 6]))
  }
}