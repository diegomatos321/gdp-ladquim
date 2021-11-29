import Phaser from "phaser"
import CONSTANTS from "../constants.json"

export default class GameTimer {

  constructor(scene, x, y) {

    this.graphics = scene.add.graphics({x: x,y: y})
    this.graphics.clear()

    this.totalTime = CONSTANTS["GAME-TIMER"]
    this.hsv = Phaser.Display.Color.HSVColorWheel();
    this.timerEvent = scene.time.addEvent({ delay: this.totalTime, loop: false })
    this.hasEnded = false

  }

  /**
   * 
   * Functions
   * 
   */

  updateTimer() {
    this.graphics.clear()

    this.graphics.fillStyle(this.hsv[8].color, 1)
    this.graphics.fillRect(0, 16, 1400 * this.timerEvent.getProgress(), 24)
    if(this.timerEvent.getProgress() == 1) {
      this.hasEnded = true
    }
  }

}