import Phaser from "phaser"
import crossSceneEventEmitter from "../../Singletons/CrossSceneEventEmitter";
import BaseCollectableItem from "./BaseCollectableItem";
import GLOBAL_CONSTANTS from "../../GLOBAL_CONSTANTS.json";
import ESTATUA_CONSTANTS from "../ESTATUA_CONSTANTS.json";

export default class Verniz extends BaseCollectableItem {
  constructor(scene, x, y) {
    super(scene, x, y, "verniz");
    this.textura = this.scene.add.image(0, 0, "verniz");

    this.setData("power", 50);
  }

  usedBy = (object) => {
    if (object.getData("tipo-estatua") === ESTATUA_CONSTANTS.MADEIRA) {
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "heal-sfx");
        object.handleHeals(this.getData("power"));
    } else {
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "damage-sfx");
        object.handleDamage(this.getData("power"));
    }
  }
}