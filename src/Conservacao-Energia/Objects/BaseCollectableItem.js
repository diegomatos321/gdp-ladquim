export default class BaseCollectableItem extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.textura = this.scene.add.image(0, 0, "verniz");
        this.setState("isDragging", false);
        this.setDepth(10);
    }
}