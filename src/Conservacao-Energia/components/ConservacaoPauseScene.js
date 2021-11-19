import CONSTANTS from '../../constants.json'

export default class ConservacaoPauseScene extends Phaser.Scene {

  constructor(){
    super({key: CONSTANTS['CONSERVACAO_PAUSE_MENU_SCENE']})
  }

  preload(){
    this.load.image('pauseImage', new URL("../images/paused.jpg", import.meta.url).pathname);
  }

  create(){
    this.add.image(900, 500, 'pauseImage').setAlpha(1);
    
    this.input.keyboard.on('keyup-' + 'W', function () {
      this.scene.resume(CONSTANTS['MINI_GAME_QUIMICA_CONSERVACAO']);
      this.scene.stop(CONSTANTS['CONSERVACAO_PAUSE_MENU_SCENE'])
    }, this);
  }

  static LoadPauseScene(gameScene){

    gameScene.input.keyboard.on('keydown-' + 'W', function () {
          gameScene.scene.pause();
          gameScene.scene.launch(CONSTANTS['CONSERVACAO_PAUSE_MENU_SCENE']);
    }, gameScene);

    gameScene.events.on('pause', function () {
      console.log('Game Scene paused');
    })

    gameScene.events.on('resume', function () {
      console.log('Game Scene resumed');
    })
  }
}
