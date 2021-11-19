import Phaser from "phaser"

export default class VasoAntigo extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "vaso");

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setState("isDragging", false);
    this.setData("health", 100);
    this.setInteractive({draggable: true});
    this.setDepth(10);

    this.on("dragstart", this.handleDragStart);
    this.on("drag",  this.handleDrag);
    this.on("dragend", this.handleDragEnd);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }
  
  handleDragStart() {
    this.setState("dragstart");
    this.body.moves = false;
    this.body.setVelocityY(0);
  }
  
  handleDrag(pointer, dragX, dragY) {
    this.setPosition(dragX, dragY);
  }
  
  handleDragEnd() {
    this.setState("dragend");
    this.body.moves = true;
  }
  
  cleanEvents = (sys) => {
    console.log("Cleaning events from VasoAntigo")
    this.removeListener("dragstart", this.handleDragStart);
    this.removeListener("drag",  this.handleDrag);
    this.removeListener("dragend", this.handleDragEnd);
  }
}