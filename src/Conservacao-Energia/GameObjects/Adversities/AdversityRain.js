import Phaser from "phaser"
import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter"

export default class AdversityRain extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, image, audio) {
        super(scene, x, y);

        // this.scene.add.existing(this);
        this.imagem = this.scene.add.image(this.x, this.displayHeight, image)
        this.audioSFX = audio
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, this.audioSFX);
        this.scene.physics.add.existing(this);

        this.setDisplaySize(400, this.scene.game.config.height);

        this.createRainParticles();

        this.timerEvent = this.scene.time.addEvent({ delay: 10000, loop: false, callback: this.destroyRain });

        this.setData("power", 0.5);
        this.setData("tipo", "chuva");

        this.addListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }

    createRainParticles = () => {
        this.rainDropParticles = this.scene.add.particles("raindrop");

        const source = new Phaser.Geom.Line(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2, this.x + this.displayWidth / 2, this.y - this.displayHeight / 2);

        this.rainDropParticles.createEmitter({
            speedY: 300,
            gravityY: 1000,
            lifespan: 100000,
            quantity: 10,
            frequency: 20,
            rotate: -15,
            emitZone: {
                source,
                type: "random"
            },
        })
    }

    destroyRain = () => {
        this.imagem.destroy();
        this.rainDropParticles.destroy()
        this.timerEvent.destroy()
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_AUDIO, this.audioSFX);
        this.destroy()
    }

    dealsDamage = (object) => {
        // toca sfx
        object.handleDamage(this.getData("power"));
    }

    cleanEvents = (sys) => {
        sys.scene.time.removeEvent(this.timerEvent);
    }
}