import Phaser from "phaser"

export default class AdversityRain extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y);

        // this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setDisplaySize(400, this.scene.game.config.height);

        this.createRainParticles();

        this.timerEvent = this.scene.time.addEvent({ delay: 10000, loop: false, callback: this.destroyRain });

        this.setData("power", 0.5);
        this.setData("tipo", "chuva");
    }

    createRainParticles = () => {
        this.rainDropParticles = this.scene.add.particles("raindrop");

        const source = new Phaser.Geom.Line(this.x - this.displayWidth / 2, this.y - this.displayHeight / 2, this.x + this.displayWidth / 2, this.y - this.displayHeight / 2);

        this.rainDropParticles.createEmitter({
            speedY: 300,
            gravityY: 1000,
            lifespan: 100000,
            quantity: 10,
            frequency: 20,
            rotate: -15,
            emitZone: {
                source,
                type: "random"
            },
        })
    }

    destroyRain = () => {
        console.dir(this.rainDropParticles);
        this.rainDropParticles.destroy()
        this.timerEvent.destroy()
        this.destroy()
    }

    dealsDamage = (object) => {
        // toca musica
        object.handleDamage(this.getData("power"));
    }
}