export default class FullScreenBtn extends Phaser.GameObjects.Image {
  constructor(scene, x = scene.game.config.width - 16, y = 16) {
    super(scene, x, y, "ui-atlas", "fullscreen");

    this.scene.add.existing(this)

    this.setOrigin(1, 0);
    this.setInteractive();

    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleFullScreenMode);
    this.on(Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, this.handleFullScreenUnsupported);
    this.on(Phaser.GameObjects.Events.DESTROY, this.cleanEvents)
  }

  handleFullScreenMode = () => {
    this.scene.scale.toggleFullscreen();

    // Por algum motivo o estado de tela cheia ainda não foi atualizado. Então eu só faço o contrário
    // do método sync
    this.scene.scale.isFullscreen ? this.setTexture("ui-atlas", "fullscreen") : this.setTexture("ui-atlas", "fullscreen-clicked");
  }

  syncTextureWithFullscreenState = () => {
    console.log("Is Fullscreen: " + this.scene.scale.isFullscreen);
    this.scene.scale.isFullscreen ? this.setTexture("ui-atlas", "fullscreen-clicked") : this.setTexture("ui-atlas", "fullscreen");
  }

  handleFullScreenUnsupported = () => {
    console.error("FullScreen não é suportado !!")
  }

  cleanEvents = () => {
    console.log("Cleaning events from FullScreenBtn")
    this.removeListener(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleFullScreenMode);
    this.removeListener(Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, this.handleFullScreenUnsupported)
    this.removeListener(Phaser.GameObjects.Events.DESTROY, this.cleanEvents)
  }
}
