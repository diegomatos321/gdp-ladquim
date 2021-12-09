import Phaser from "phaser";
import CONSTANTS from "../../constants.json"

export default class SliderButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, key) {
    super(scene, x, y)

    this.scene.add.existing(this);

    this.key = key;
    
    this.fundo = this.scene.add.image(0, 0, "common-atlas", "slider-background")
    this.add(this.fundo)
    
    this.sliderFundo = this.scene.add.image(100, 0, "common-atlas", "slider-fundo")
    this.sliderBorder = this.scene.add.image(this.sliderFundo.x, 0, "common-atlas", "slider-border")
    this.add([this.sliderFundo, this.sliderBorder])
    
    this.sliderStick = this.scene.add.image(this.sliderFundo.x, 0, "common-atlas", "slider-stick").setInteractive({
      draggable: true
    });
    this.add(this.sliderStick)

    this.minValue = this.sliderFundo.x - this.sliderFundo.width / 2;
    this.maxValue = this.sliderFundo.x + this.sliderFundo.width / 2;
    this.value = (this.sliderStick.x - this.minValue) / (this.maxValue - this.minValue);
    console.log(this.value)

    const paddingLeft = 150;
    const textStyle = {
      fontFamily: "Nunito-Bold", 
      fontSize: "43px"
    }
    this.text = this.scene.add.text(-this.fundo.width/2 + paddingLeft, 0, text, textStyle).setOrigin(0.5)
    this.add(this.text)

    this.sliderStick.on(Phaser.Input.Events.DRAG, this.handleDrag);
  }

  handleDrag = (pointer, dragX, dragY) => {
    const newPosition = Phaser.Math.Clamp(dragX, this.minValue, this.maxValue)
    this.sliderStick.setPosition(newPosition, this.sliderStick.y);

    const distanteToBeginningOfStick = Math.abs(newPosition-this.minValue);
    const totalLength = this.maxValue - this.minValue
    this.value = distanteToBeginningOfStick/totalLength
    this.emit(CONSTANTS.VALUE_CHANGED, this.value)
  }
}