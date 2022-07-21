import Phaser from "phaser"

export default class Rain extends Phaser.Geom.Line {
  constructor(scene, posStart, particle, index) {
    super(posStart, 0, posStart + 400, 0);
   
    this.index = index;
    this.raindropParticles = scene.add.particles(particle)
    this.hitArea = this.createRainHitArea(scene);
    
    this.timerEvent = scene.time.addEvent({delay: 10000, loop: false})
  }

  static CreateEmitter(particles, source) {
    particles.createEmitter({
      speedY: 300,
      gravityY: 1000,
      lifespan: 100000,
      quantity: 10,
      frequency: 20,
      rotate: -15,
      emitZone: {
        source: source,
        type: "random"
      },
    });
  }

  createRainHitArea = (scene) => {
    let widthOfRainHitArea = Phaser.Geom.Line.Length(this);
    let heightOfRainHitArea = scene.game.config.height - this.y1;

    let rainHitArea = scene.add.rectangle(this.x1 + widthOfRainHitArea / 2, this.y1 + heightOfRainHitArea / 2, widthOfRainHitArea, heightOfRainHitArea);
    console.log(rainHitArea);

    rainHitArea.setData("power", 0.5);
    rainHitArea.setData("index", this.index);
    rainHitArea.setData("tipo", "chuva");
    
    return rainHitArea;
  }

  updateRain = () => {
    if(this.timerEvent.getProgress() == 1) {
     console.log("FOI")
      this.raindropParticles.destroy()
      this.hitArea.destroy()
      this.timerEvent.destroy()

      return false
    }

    return true
  }

  dealsDamage = (object) => {
    // toca musica
    object.handleDamage(this.hitArea.getData("power"));
  }
}