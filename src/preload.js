import Phaser from "phaser"
import LoadingInterface from "./common/scripts/LoadingInterface";
import commonAtlas from "./common/atlas/common-textures.json"
import uiAtlas from "./common/atlas/ui-textures.json"
import DetectTouchScreen from "./common/scripts/DetectTouchScreen"
import GLOBAL_CONSTANTS from "./GLOBAL_CONSTANTS.json"

import WebFont from "webfontloader";
import crossSceneEventEmitter from "./Singletons/CrossSceneEventEmitter";

export default class Preload extends Phaser.Scene {
  constructor() {
    super({key: GLOBAL_CONSTANTS.PRELOAD});
  }

  preload = () => {
    this.load.image("GDP-LOGO", new URL("./common/images/GDP.png?quality=100&width=100", import.meta.url).pathname)
    this.load.image("LADQUIM-LOGO", new URL("./ui/icons/ladquim-logo.png?quality=100&width=200", import.meta.url).pathname)
    new LoadingInterface(this, this.game.config.width/2, this.game.config.height/2)
    this.load.atlas("common-atlas", new URL("./common/atlas/common-textures.png", import.meta.url).pathname, commonAtlas);
    this.load.atlas("ui-atlas", new URL("./common/atlas/ui-textures.png", import.meta.url).pathname, uiAtlas);    

    window.localStorage.setItem("isMobile", DetectTouchScreen())
  }

  create = () => {
    this.scene.launch(GLOBAL_CONSTANTS.GAME_MANAGER)
    this.scene.run(GLOBAL_CONSTANTS.AUDIO_MANAGER)

    WebFont.load({
      google: {
        families: ["Nunito:b,bi,extrabold,extrabolditalic"]
      },
      active: this.StartGame,
      inactive: () => this.ShowErrorMessage("Seu navegador não suporta Web Fonts"),
      fontinactive: () => this.ShowErrorMessage("Não foi possível carregar a fonte.")
    })
  }

  StartGame = () => {
    this.sound.pauseOnBlur = false;
    this.scene.start(GLOBAL_CONSTANTS.MAIN_MENU)
  }

  ShowErrorMessage = (message) => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.SHOW_ERROR_MESSAGE, message)
  }
}