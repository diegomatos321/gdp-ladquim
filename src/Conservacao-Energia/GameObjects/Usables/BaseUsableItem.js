export default class BaseUsableItem extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setInteractive({
            draggable: true
        });
        this.setState("isDragging", false);
        this.setDepth(10);
    }
}