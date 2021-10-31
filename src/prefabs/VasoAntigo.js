import Phaser from "phaser"

export default class VasoAntigo extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "vaso");

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
}