export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, textConfig) {
    super(scene, x, y);

    scene.add.existing(this)

    let botao = scene.add.rexNinePatch({
      x: 0, 
      y: 0, 
      width: 350, 
      height: 97, 
      key: "menu-atlas", 
      baseFrame: "menu-botao", 
      columns: [6, undefined, 6], 
      rows: [6, undefined, 6]
    })
    this.add(botao)
    
    const buttonText = scene.add.text(0, 0, text, textConfig).setOrigin(0.5);
    this.add(buttonText)
    
    this.setInteractive(new Phaser.Geom.Rectangle(-botao.width/2, -botao.height/2, botao.width, botao.height), Phaser.Geom.Rectangle.Contains);
    this.on(Phaser.Input.Events.POINTER_OVER, () => botao.setTexture("menu-atlas", "menu-botao-hover", [6, undefined, 6], [6, undefined, 6]))
    this.on(Phaser.Input.Events.POINTER_OUT, () => botao.setTexture("menu-atlas", "menu-botao", [6, undefined, 6], [6, undefined, 6]))
  }
}