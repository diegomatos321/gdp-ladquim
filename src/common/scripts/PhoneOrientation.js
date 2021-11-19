import CONSTANTS from '../../constants.json'

export default class PhoneOrientation  {
  
  static CheckOrientation(scaleOrientation) {
    if(!this.orientationText) {
      this.orientationText = this.add.text(this.game.config.width/2, 20, "").setOrigin(0.5);
    }

    if (scaleOrientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      this.orientationText.setText("Vire o seu celular na Horizontal");
    } else if (scaleOrientation === Phaser.Scale.LANDSCAPE) {
      console.log("LANDSCAPE");
      this.orientationText.setText("");
    }
  }

  
}