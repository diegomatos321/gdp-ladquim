import Phaser from "phaser"

export default class HealthBar extends Phaser.GameObjects.Container {
  constructor(scene, x, y, customMaxWidth = 200){
    super(scene, x, y)

    this.scene.add.existing(this);

    this.maxHealthWidth = customMaxWidth;

    this.leftCap = this.scene.add.image(0, 0, 'left-cap')
      .setOrigin(0, 0.5)
    this.middle = this.scene.add.image(this.leftCap.displayWidth, 0, 'middle')
      .setOrigin(0, 0.5)
    this.middle.displayWidth = this.maxHealthWidth
    this.rightCap = this.scene.add.image(this.middle.x + this.middle.displayWidth, this.middle.y, 'right-cap')
      .setOrigin(0, 0.5)
    
    this.add([this.leftCap, this.middle, this.rightCap]);
  }

  setMeterPercentage = (percent = 1) => {
    let newWidth = this.maxHealthWidth * percent

    this.middle.displayWidth = newWidth
    this.rightCap.x = this.middle.x + this.middle.displayWidth
  }

  setMeterPercentageAnimated = (percent = 1, duration = 100) => {
    let newWidth = this.maxHealthWidth * percent

    this.scene.tweens.add({
      targets: this.middle,
      displayWidth: newWidth,
      duration,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.rightCap.x = this.middle.x + this.middle.displayWidth
      },
      onComplete: () => {
        // if(percent <= 0.01)
        //   this.setVisible(false)
      }
    })
  }
}