export default function fullScreenBtn(scene) {
  let fullscreenBtn = scene.add.sprite(scene.game.config.width - 16, 16, "fullscreen-icon", 0).setOrigin(1, 0).setInteractive();
  fullscreenBtn.on(Phaser.Input.Events.POINTER_UP, handleFullScreenMode);

  function handleFullScreenMode() {
    if (scene.scale.isFullscreen) {
      fullscreenBtn.setFrame(0);
      scene.scale.stopFullscreen();
    } else {
      fullscreenBtn.setFrame(1);
      scene.scale.startFullscreen();
    }
  }

  return fullscreenBtn;
}
