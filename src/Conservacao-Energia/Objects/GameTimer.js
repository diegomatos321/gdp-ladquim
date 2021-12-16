import Phaser from "phaser"
import GAME_CONSTANTS from "../GAME_CONSTANTS.json"

export default class GameTimer {

  constructor(scene, x, y) {

    this.graphics = scene.add.graphics({x: x,y: y})
    this.graphics.clear()

    this.totalTime = GAME_CONSTANTS["GAME-TIMER"]
    this.hsv = Phaser.Display.Color.HSVColorWheel();
    this.timerEvent = scene.time.addEvent({ delay: this.totalTime, loop: false })
    this.hasEnded = false

    scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  /**
   * 
   * Functions
   * 
   */

  updateTimer = () => {
    this.graphics.clear()

    this.graphics.fillStyle(this.hsv[8].color, 1)
    this.graphics.fillRect(0, 16, 1400 * this.timerEvent.getProgress(), 24)
    if(this.timerEvent.getProgress() == 1) {
      this.hasEnded = true
    }
  }

  cleanEvents = (sys) => {
    console.log("Cleaning events from GameTimer")
    sys.scene.time.removeEvent(this.timerEvent);
  }
}