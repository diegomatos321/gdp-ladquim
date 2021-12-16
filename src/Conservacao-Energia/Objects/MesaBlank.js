import Phaser from "phaser"

export default class MesaBlank extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setSize(1000, this.displayHeight/3, true);
  }
}