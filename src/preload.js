import Phaser from "phaser"
import LoadingInterface from "./common/scripts/LoadingInterface";
import commonAtlas from "./common/atlas/common-textures.json"
import uiAtlas from "./common/atlas/ui-textures.json"
import CONSTANTS from "./constants.json"

export default class Preload extends Phaser.Scene {
  constructor() {
    super({key: CONSTANTS.PRELOAD});
  }

  preload = () => {
    new LoadingInterface(this)
    this.load.atlas("common-atlas", new URL("./common/atlas/common-textures.png", import.meta.url).pathname, commonAtlas);
    this.load.atlas("ui-atlas", new URL("./common/atlas/ui-textures.png", import.meta.url).pathname, uiAtlas);    this.load.image("pauseImage", new URL("./common/images/paused.jpg", import.meta.url).pathname);
  }

  create = () => {
    this.scene.launch(CONSTANTS.GAME_MANAGER)

    this.scene.start(CONSTANTS.MAIN_MENU)
  }
}