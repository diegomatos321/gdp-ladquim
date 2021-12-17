import Phaser from "phaser";

const text = "Vire o seu celular na Horizontal";
const textStyle = {
  fontFamily: "Nunito-Black", 
  fontSize: "43px", 
  backgroundColor: "#ad1403", 
  padding: 30
};

export default class CheckOrientation extends Phaser.GameObjects.Text{
  constructor(scene, x, y) {
    super(scene, x, y, text, textStyle)

    this.scene.add.existing(this)

    this.setOrigin(0.5);
    this.setVisible(false);

    this.handleChangeOrientation(this.scene.scale.orientation);
    this.scene.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleChangeOrientation = (scaleOrientation) => {
    if (scaleOrientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      this.setVisible(true);
    } else if (scaleOrientation === Phaser.Scale.LANDSCAPE) {
      console.log("LANDSCAPE");
      this.setVisible(false);
    }
  }

  cleanEvents = (sys) => {
    console.log("Cleaning Events from CheckOrientation")
    sys.scene.scale.removeListener(Phaser.Scale.Events.ORIENTATION_CHANGE, this.handleChangeOrientation);
  }
}