import Phaser from "phaser"
import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";
import GAME_CONSTANTS from "../GAME_CONSTANTS.json"

export default class GameTimer {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = 70;
        this.max = 100;
        this.current = 0;

        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(0xffffff);
        this.graphics.fillCircle(this.x, this.y, this.radius);

        this.maskShape = this.scene.make.graphics();
        this.maskShape.fillCircle(this.x, this.y, this.radius);

        this.graphics.setMask(this.maskShape.createGeometryMask());

        this.totalTime = GAME_CONSTANTS["GAME-TIMER"];

        this.timerEvent = this.scene.time.addEvent({ delay: 1_000, loop: true, callback: this.handleClock });

        this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
    }

    /**
     * 
     * Functions
     * 
     */

    handleClock = () => {
        this.current += this.max / this.totalTime; // Inversamente proporcional ao tempo em segundos, ou seja, quanto mais tempo levar mais devagar deve ir.

        if (this.current >= this.max) {
            this.maskShape.clear();
            crossSceneEventEmitter.emit(GAME_CONSTANTS.GAME_FINISHED);
            this.timerEvent.remove();
            return;
        }
        

        this.maskShape.clear();
        this.maskShape.beginPath();

        this.maskShape.moveTo(this.x, this.y);

        const startRadiansAngle = Math.PI + Math.PI / 2;
        const endRadiansAngle = startRadiansAngle + (Math.PI * 2 * (this.current / 100));
        this.maskShape.arc(this.x, this.y, this.radius, startRadiansAngle, endRadiansAngle, true);

        this.maskShape.fillPath();
    }

    cleanEvents = (sys) => {
        console.log("Cleaning events from GameTimer")
        sys.scene.time.removeEvent(this.timerEvent);
    }
}