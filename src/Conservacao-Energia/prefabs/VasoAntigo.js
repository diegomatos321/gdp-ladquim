import Phaser from "phaser"

export default class VasoAntigo extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "vaso");

    var scene = scene

    scene.fullWidth = 300

    const leftShadowCap = scene.add.image(x, y, 'left-cap-shadow')
      .setOrigin(0, 0.5)

    const middleShaddowCap = scene.add.image(leftShadowCap.x + leftShadowCap.width, y, 'middle-shadow')
      .setOrigin(0, 0.5)
    middleShaddowCap.displayWidth = this.fullWidth

    scene.add.image(middleShaddowCap.x + middleShaddowCap.displayWidth, y, 'right-cap-shadow')
      .setOrigin(0, 0.5)

    this.leftCap = scene.add.image(x, y, 'left-cap')
		.setOrigin(0, 0.5)

    this.middle = scene.add.image(this.leftCap.x + this.leftCap.width, y, 'middle')
      .setOrigin(0, 0.5)

    this.rightCap = scene.add.image(this.middle.x + this.middle.displayWidth, y, 'right-cap')
      .setOrigin(0, 0.5)

    this.setMeterPercentage(1)

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setState("isDragging", false);
    this.setData("health", 100);
    this.setInteractive({draggable: true});
    this.setDepth(10);

    this.on("dragstart", () => {
      this.setState("dragstart");
      this.body.moves = false;
      this.body.setVelocityY(0);
    });
    
    this.on("drag", (pointer, dragX, dragY) => {
      this.setPosition(dragX, dragY);
    });
    
    this.on("dragend", () => {
      this.setState("dragend");
      this.body.moves = true;
    });
  }

  damageItem = (damageValue) => {
    if(this.getData("health") > 0) {
      const currentColor = Phaser.Display.Color.ValueToColor("#ffffff");
      const finalColor = Phaser.Display.Color.ValueToColor("#ff0000");

      if(!this.isTinted) {
        this.setTint("#ffffff");
      }

      this.incData("health", -0.1);
      this.setMeterPercentageAnimated(this.getData("health") / 100)

      const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(currentColor, finalColor, 100, 100 - this.getData("health"));
      const colorNumber = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b);

      this.setTint(colorNumber);
    }
  }

  setMeterPercentage(percent = 1)
  {
    let width = this.scene.fullWidth * percent
    console.log(this)
    console.log(this.scene.fullWidth)

    this.middle.displayWidth = width
    this.rightCap.x = this.middle.x + this.middle.displayWidth
  }

  setMeterPercentageAnimated(percent = 1, duration = 1000)
  { 
    let width = this.scene.fullWidth * percent
    

    this.scene.tweens.add({
      targets: this.middle,
      displayWidth: width,
      duration,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.rightCap.x = this.middle.x + this.middle.displayWidth

        this.leftCap.visible = this.middle.displayWidth > 0
        this.middle.visible = this.middle.displayWidth > 0
        this.rightCap.visible = this.middle.displayWidth > 0
      }
    })
  }
}