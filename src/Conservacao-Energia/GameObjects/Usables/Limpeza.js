import Phaser from "phaser"
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter";
import BaseUsableItem from "./BaseUsableItem";
import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";

export default class Limpeza extends BaseUsableItem {
  constructor(scene, x, y) {
    super(scene, x, y, "limpeza");

    this.setData("power", 50);
  }

  usedBy = (object) => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "damage-sfx");
    object.handleDamage(this.getData("power"));
    this.destroy();
  }
}