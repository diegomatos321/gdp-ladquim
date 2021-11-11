export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, textConfig) {
    super(scene, x, y);

    scene.add.existing(this)

    const imageWidth = 350, imageHeight = 97

    // A origem do Container é no canto superior esquerdo, realizo esse offset para as imagens ficarem no centro do container
    let botao = scene.add.image(imageWidth/2, imageHeight/2, "menu-atlas", "menu-botao");
    botao.setInteractive();
    botao.on(Phaser.Input.Events.POINTER_OVER, () => botao.setTexture("menu-atlas", "menu-botao-hover"))
    botao.on(Phaser.Input.Events.POINTER_OUT, () => botao.setTexture("menu-atlas", "menu-botao"))
    this.add(botao)

    const buttonText = scene.add.text(botao.x, botao.y, text, textConfig).setOrigin(0.5);
    this.add(buttonText)
  }
}