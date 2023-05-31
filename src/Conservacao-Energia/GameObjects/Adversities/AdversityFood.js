import Phaser from "phaser"
import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter"

export default class AdversityFood extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, image, audio) {
        super(scene, x, y);

        // this.scene.add.existing(this);
        this.imagem = this.scene.add.image(this.x, this.displayHeight, image)
        this.imagem.setFlipY(true)
        this.audioSFX = audio
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, this.audioSFX);
        this.scene.physics.add.existing(this);

        this.setDisplaySize(400, this.scene.game.config.height);

        this.createFoodParticles();

        this.timerEvent = this.scene.time.addEvent({ delay: 10000, loop: false, callback: this.destroyFood });

        this.setData("power", 0.3);
        this.setData("tipo", "comida");

        this.addListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }

    createFoodParticles = () => {
        this.rosquinhaDropParticles = this.scene.add.particles("comida-rosquinha");
        this.macaDropParticles = this.scene.add.particles("comida-maca");

        const source = new Phaser.Geom.Line(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2, this.x + this.displayWidth / 2, this.y - this.displayHeight / 2);

        this.rosquinhaDropParticles.createEmitter({
            speedY: 300,
            gravityY: 1000,
            frequency: 200,
            lifespan: { min: 1000, max: 2000 },
            quantity: 1,
            rotate: -15,
            emitZone: {
                source,
                type: "random"
            },
        })

        this.macaDropParticles.createEmitter({
            speedY: 300,
            gravityY: 1000,
            frequency: 200,
            lifespan: { min: 1000, max: 2000 },
            quantity: 1,
            rotate: -15,
            emitZone: {
                source,
                type: "random"
            },
        })
    }

    destroyFood = () => {
        this.imagem.destroy();
        this.rosquinhaDropParticles.destroy();
        this.macaDropParticles.destroy();
        this.timerEvent.remove();
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_AUDIO, this.audioSFX);
        this.destroy()
    }

    dealsDamage = (object) => {
        object.handleDamage(this.getData("power"));
    }

    cleanEvents = (sys) => {
        sys.scene.time.removeEvent(this.timerEvent);
    }
}