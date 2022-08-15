import Phaser from "phaser"
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter";
import BaseUsableItem from "./BaseUsableItem";
import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";
import GAME_OBJECT_CONSTANTS from "../../GAME_OBJECT_CONSTANTS.json";

export default class Lixo extends BaseUsableItem {
  constructor(scene, x, y) {
    super(scene, x, y, "lixo");
    this.textura = this.scene.add.image(0, 0, "lixo");

    this.setData("power", 50);
  }

  usedBy = (object) => {

    if(object.getData("tipo-quadro") || object.getData("tecido") || object.getData("livro")) {
      crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "damage-sfx");
      object.handleDamage(this.getData("power"));
      this.destroy();
    }

  }
}