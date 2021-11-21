import Phaser from "phaser"
import FullScreenBtn from "../common/scripts/fullScreenBtn";
import CONSTANTS from "../constants.json"

export default class GUI extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.GUI});
  }
  
  create() {
    this.scene.bringToTop()
    this.fullScreenBtn = new FullScreenBtn(this)
  }
}