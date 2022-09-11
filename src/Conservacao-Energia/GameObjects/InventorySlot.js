import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";
import GAME_CONSTANTS from "../GAME_CONSTANTS.json";

export default class InventorySlot extends Phaser.GameObjects.Container {
    static slotWidth = 250;
    static slotHeight = 250;

    usableSlot;
    usableImage;
    usableLabel;

    constructor(scene, x, y, name, amount) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.usableSlot = this.scene.add.image(0, 0, 'slot-inventario');
        this.usableImage = this.scene.add.image(0, 0, name);

        const fontSize = 36;
        const paddingRight = 26;
        const paddingBottom = 14;
        this.usableLabel = this.scene.add.text((InventorySlot.slotWidth / 2) - (fontSize / 2 + paddingRight), (InventorySlot.slotHeight / 2) - (fontSize / 2 + paddingBottom), `x${amount}`, {
            fontSize
        }).setOrigin(0.5);

        this.setName(name);
        this.setData('amount', amount);

        this.add([this.usableSlot, this.usableImage, this.usableLabel]);

        this.setInteractive(new Phaser.Geom.Rectangle(-InventorySlot.slotWidth / 2, -InventorySlot.slotHeight / 2, InventorySlot.slotWidth, InventorySlot.slotHeight), Phaser.Geom.Rectangle.Contains);

        this.addListener(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleItemSelected);
    }

    handleItemSelected = () => {
        console.log("Handle Item Selected");
        crossSceneEventEmitter.emit(GAME_CONSTANTS.ITEM_SELECTED, this.name);
    }
}