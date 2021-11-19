import CONSTANTS from '../../constants.json'

export default class FinishGame  {
  
  static FinishToMainMenu(scene) {
    scene.scene.start(CONSTANTS['MAIN_MENU']);
  }

  static FinishToLeaderBoard(scene) {

  }

  static FinishToCredits(scene) {

  }
}