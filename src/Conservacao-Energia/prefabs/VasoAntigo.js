import Phaser from "phaser"
import HealthBar from "../../common/scripts/HealthBar";

export default class VasoAntigo extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.textura = this.scene.add.image(0, 0, "vaso");
    this.healthBar = new HealthBar(this.scene, -this.textura.displayWidth/2, -this.textura.displayHeight, this.textura.displayWidth);
    this.body.setOffset(-this.textura.displayWidth/2, -this.textura.displayHeight/2);
    this.body.setSize(this.textura.displayWidth, this.textura.displayHeight);
    this.add([this.textura, this.healthBar]);

    this.setState("isDragging", false);
    this.setData("health", 100);
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-this.textura.displayWidth/2, -this.textura.displayHeight/2, this.textura.displayWidth, this.textura.displayHeight), 
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true
    })
    this.setDepth(10);

    this.on(Phaser.Input.Events.DRAG_START, this.handleDragStart);
    this.on(Phaser.Input.Events.DRAG, this.handleDrag);
    this.on(Phaser.Input.Events.DRAG_END, this.handleDragEnd);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  damageItem = (damageValue = 0.1) => {
    this.incData("health", -damageValue);

    if (this.getData("health") > 0.01) {
      const currentColor = Phaser.Display.Color.ValueToColor("#ffffff");
      const finalColor = Phaser.Display.Color.ValueToColor("#ff0000");

      if (!this.textura.isTinted) {
        this.textura.setTint("#ffffff");
      }

      this.healthBar.setMeterPercentageAnimated(this.getData("health") / 100)

      const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(currentColor, finalColor, 100, 100 - this.getData("health"));
      const colorNumber = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b);

      this.textura.setTint(colorNumber);
    }
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
    this.setState("dragend");
    this.body.moves = true;
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from VasoAntigo")
    this.removeListener("dragstart", this.handleDragStart);
    this.removeListener("drag", this.handleDrag);
    this.removeListener("dragend", this.handleDragEnd);
  }
}