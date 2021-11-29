export default class FullScreenBtn extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene, scene.game.config.width - 16, 16, "common-atlas", "fullscreen");

    this.scene.add.existing(this)

    this.setOrigin(1, 0);
    this.setInteractive();

    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleFullScreenMode);
    this.on(Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, this.handleFullScreenUnsupported);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents)
  }

  handleFullScreenMode = () => {
    this.scene.scale.isFullscreen ? this.setTexture("common-atlas", "fullscreen") : this.setTexture("common-atlas", "fullscreen-clicked")
    this.scene.scale.toggleFullscreen();
  }

  handleFullScreenUnsupported = () => {
    console.error("FullScreen não é suportado !!")
  }

  cleanEvents = () => {
    console.log("Cleaning events from FullScreenBtn")
    this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleFullScreenMode);
    this.removeListener(Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, this.handleFullScreenUnsupported)
  }
}
