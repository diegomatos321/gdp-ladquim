export default class AdversitySun extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, image) {
        super(scene, x, y);

        this.scene.physics.add.existing(this);
        this.imagem = this.scene.add.image(this.x, this.displayHeight, image)

        this.setDisplaySize(400, this.scene.game.config.height);
        this.drawYellowArea();

        this.timerEvent = this.scene.time.addEvent({
            delay: 10000,
            loop: false,
            callback: this.destroySun
        })

        this.setData("power", 0.3);
        this.setData("tipo", "sol-forte");

        this.addListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents);
    }

    drawYellowArea = () => {
        this.yellowArea = this.scene.add.graphics();
        this.yellowArea.fillStyle(0xffff00, 0.3);
        this.yellowArea.fillRect(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2, 400, this.displayHeight);
    }

    destroySun = () => {
        this.imagem.destroy();  
        this.timerEvent.destroy();
        this.yellowArea.destroy();
        this.destroy();
    }

    dealsDamage = (object) => {
        object.handleDamage(this.getData("power"));
    }

    cleanEvents = (sys) => {
        sys.scene.time.removeEvent(this.timerEvent);
    }
}