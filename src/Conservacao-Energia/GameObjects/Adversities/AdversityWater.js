import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter"
import GAME_OBJECT_CONSTANTS from "../../GAME_OBJECT_CONSTANTS.json";



export default class AdversityWater extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, image, audio) {
        super(scene, x, y);

        this.scene.physics.add.existing(this);
        this.imagem = this.scene.add.image(this.x, this.y + 200, image)
        this.imagem2 = this.scene.add.image(this.x + 300, this.y + 200, image)
        this.imagem3 = this.scene.add.image(this.x + 600, this.y + 200, image)
        this.imagem4 = this.scene.add.image(this.x + 900, this.y + 200, image)
        this.imagem5 = this.scene.add.image(this.x - 300, this.y + 200, image)
        this.imagem6 = this.scene.add.image(this.x - 600, this.y + 200, image)
        this.imagem7 = this.scene.add.image(this.x - 900, this.y + 200, image)


        this.audioSFX = audio

        this.setDisplaySize(this.scene.game.config.width, 400);
        this.drawRedArea();

        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, this.audioSFX);

        this.timerEvent = this.scene.time.addEvent({
            delay: 10000,
            loop: false,
            callback: this.destroyWater
        })

        this.setData("power", 0.3);
        this.setData("tipo", "folhas");

        this.addListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }

    drawRedArea = () => {
        this.redArea = this.scene.add.graphics();
        this.redArea.fillStyle(0xadd8e6, 0.5);
        // Deixar responsivo
        this.redArea.fillRect(0,this.displayHeight+280, this.displayWidth, 400);
    }

    destroyWater = () => {
        this.imagem.destroy();
        this.imagem2.destroy();
        this.imagem3.destroy();
        this.imagem4.destroy();
        this.imagem5.destroy();
        this.imagem6.destroy();
        this.imagem7.destroy();
        this.timerEvent.remove();
        this.redArea.destroy();
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.STOP_AUDIO, this.audioSFX);
        this.destroy();
    }

    dealsDamage = (object) => {
        
        if (object.getData("tipo-estatua") == GAME_OBJECT_CONSTANTS.MARMORE) {
            return;
        }
        
        object.handleDamage(this.getData("power"));
    }

    cleanEvents = (sys) => {
        sys.scene.time.removeEvent(this.timerEvent);
    }
}