export default class FullScreenBtn extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene, scene.game.config.width - 16, 16, "common-atlas", "fullscreen");

    scene.add.existing(this)

    this.setOrigin(1, 0);
    this.setInteractive();
    this.on(Phaser.Input.Events.POINTER_UP, handleFullScreenMode);
    this.on(Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, () => console.error("Full Screen Unsupported"));

    function handleFullScreenMode() {
      scene.scale.toggleFullscreen();
    }
  }
}
