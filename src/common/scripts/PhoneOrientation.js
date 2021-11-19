import CONSTANTS from '../../constants.json'

export default class PhoneOrientation  {
  
  static CheckOrientation(scene) {
    let scaleOrientation = scene.scale.orientation

    if(!scene.orientationText) {
      scene.orientationText = scene.add.text(scene.game.config.width/2, 20, "").setOrigin(0.5);
    }

    if (scaleOrientation === Phaser.Scale.PORTRAIT) {
      console.log("PORTRAIT");
      scene.orientationText.setText("Vire o seu celular na Horizontal");
    } else if (scaleOrientation === Phaser.Scale.LANDSCAPE) {
      console.log("LANDSCAPE");
      scene.orientationText.setText("");
    }
  }

  
}