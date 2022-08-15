import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter"
import GAME_OBJECT_CONSTANTS from "../../GAME_OBJECT_CONSTANTS.json";



export default class AdversityFire extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, image, audio) {
        super(scene, x, y);

        this.scene.physics.add.existing(this);
        this.imagem = this.scene.add.image(this.x, this.y, image)
        this.audioSFX = audio

        this.setDisplaySize(this.scene.game.config.width, 400);
        this.drawRedArea();

        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, this.audioSFX);

        this.timerEvent = this.scene.time.addEvent({
            delay: 10000,
            loop: false,
            callback: this.destroyFire
        })

        this.setData("power", 0.3);
        this.setData("tipo", "fogo");

        this.addListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }

    drawRedArea = () => {
        this.redArea = this.scene.add.graphics();
        this.redArea.fillStyle(0xff0000, 0.3);
        // Deixar responsivo
        this.redArea.fillRect(0,this.displayHeight+280, this.displayWidth, 400);
    }

    destroyFire = () => {
        this.imagem.destroy();  
        this.timerEvent.remove();
        this.redArea.destroy();
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_AUDIO, this.audioSFX);
        this.destroy();
    }

    dealsDamage = (object) => {
        if(object.getData("tipo-estatua")) {
            if (object.getData("tipo-estatua") == GAME_OBJECT_CONSTANTS.MADEIRA) {
                object.handleDamage(this.getData("power"));
                return;
            }
            return;
        }
        object.handleDamage(this.getData("power"));
    }

    cleanEvents = (sys) => {
        sys.scene.time.removeEvent(this.timerEvent);
    }
}