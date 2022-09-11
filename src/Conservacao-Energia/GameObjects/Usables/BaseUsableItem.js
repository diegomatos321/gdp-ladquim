import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter";
import GAME_CONSTANTS from "../../GAME_CONSTANTS.json";

export default class BaseUsableItem extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setDepth(10);

        this.scene.input.addListener(Phaser.Input.Events.POINTER_MOVE, this.followPointer);
        this.scene.input.addListener(Phaser.Input.Events.POINTER_UP, this.handlePointerUP);
        this.addListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }

    followPointer = (pointer) => {
        this.setPosition(pointer.x, pointer.y);
    }

    handlePointerUP = () => {
        this.destroy();
    }

    destroyGameObject = () => {
        crossSceneEventEmitter.emit(GAME_CONSTANTS.ITEM_USED, this.name);
        this.destroy();
    }

    cleanEvents = () => {
        this.scene.input.removeListener(Phaser.Input.Events.POINTER_MOVE, this.followPointer);
        this.scene.input.removeListener(Phaser.Input.Events.POINTER_UP, this.handlePointerUP);
        this.removeListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }
}