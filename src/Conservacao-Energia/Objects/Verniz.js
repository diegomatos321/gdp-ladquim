import Phaser from "phaser"
import HealthBar from "../../common/scripts/HealthBar";
import ESTATUA_CONSTANTS from "./constants/ESTATUA_CONSTANTS.json"


export default class Verniz extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.textura = this.scene.add.image(0, 0, "verniz");
    this.body.setOffset(-this.textura.displayWidth/2, -this.textura.displayHeight/2);
    this.body.setSize(this.textura.displayWidth, this.textura.displayHeight);
    this.add([this.textura]);

    this.setState("isDragging", false);

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-this.textura.displayWidth/2, -this.textura.displayHeight/2, this.textura.displayWidth, this.textura.displayHeight), 
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true
    })
    this.setDepth(10);
    this.setData("power", 50);

    this.on(Phaser.Input.Events.DRAG_START, this.handleDragStart);
    this.on(Phaser.Input.Events.DRAG, this.handleDrag);
    this.on(Phaser.Input.Events.DRAG_END, this.handleDragEnd);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleDragStart = () => {
    this.setState("dragstart");
    this.body.moves = false;
    this.body.setVelocityY(0);
  }

  handleDrag = (pointer, dragX, dragY) => {
    this.setPosition(dragX, dragY);
  }

  handleDragEnd = () => {
    this.setState("dragend", true);
    this.body.moves = true;
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from EstatuaMadeira")
    this.removeListener("dragstart", this.handleDragStart);
    this.removeListener("drag", this.handleDrag);
    this.removeListener("dragend", this.handleDragEnd);
  }
}