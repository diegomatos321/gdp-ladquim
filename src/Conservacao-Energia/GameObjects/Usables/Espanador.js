import Phaser from "phaser"
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter";
import BaseUsableItem from "./BaseUsableItem";
import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";

export default class Espanador extends BaseUsableItem {
  constructor(scene, x, y) {
    super(scene, x, y, "espanador");

    this.setData("power", 50);
  }

  usedBy = (object) => {
    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "sweeping-sfx");
    object.handleHeal(this.getData("power"));
    this.destroy();
  }
}