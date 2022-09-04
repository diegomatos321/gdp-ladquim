export default class InventorySlot extends Phaser.GameObjects.Container {
    usableImage;

    constructor(scene, x, y, name) {
        super(scene, x, y);

        this.scene.add.existing(this);

        const usableSlot = this.scene.add.image(0, 0, 'slot-inventario');
        this.usableImage = this.scene.add.image(0, 0, name);
        this.usableImage.setVisible(false);

        this.setName(name);

        this.add([usableSlot, this.usableImage]);
    }

    setImageVisible = (newState) => {
        this.usableImage.setVisible(newState);
    }
}