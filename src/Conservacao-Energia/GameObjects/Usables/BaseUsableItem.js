import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter";
import GAME_CONSTANTS from "../../GAME_CONSTANTS.json";

export default class BaseUsableItem extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        /* this.setInteractive({
            draggable: true
        }); */
        this.disableBody();
        this.setDepth(10);
    }

    followPointer = () => {

    }

    setEnableToPick = (canPick) => {
        if (canPick) {
            this.setInteractive();
            this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handlePick);
        } else {
            this.removeInteractive();
            this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handlePick);
        }
    }

    handlePick = () => {
        crossSceneEventEmitter.emit(GAME_CONSTANTS.ITEM_PICK_UP, this.name);
        this.destroy();
    }
}