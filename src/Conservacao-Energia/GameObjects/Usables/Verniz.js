import Phaser from "phaser"
import crossSceneEventEmitter from "../../../Singletons/CrossSceneEventEmitter";
import BaseUsableItem from "./BaseUsableItem";
import GLOBAL_CONSTANTS from "../../../GLOBAL_CONSTANTS.json";
import GAME_OBJECT_CONSTANTS from "../../GAME_OBJECT_CONSTANTS.json";

export default class Verniz extends BaseUsableItem {
  constructor(scene, x, y) {
    super(scene, x, y, "verniz");
    this.textura = this.scene.add.image(0, 0, "verniz");

    this.setData("power", 50);
  }

  usedBy = (object) => {

    if(object.getData("tipo-estatua")) {

      if (object.getData("tipo-estatua") === GAME_OBJECT_CONSTANTS.MADEIRA) {
        crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "damage-sfx");
        object.handleDamage(this.getData("power"));
        this.destroy();
        return;
      }

      crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "heal-sfx");
      object.handleHeal(this.getData("power"));
      this.destroy();
      return;
    }

    if(object.getData("tipo-quadro")) { 
      crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "heal-sfx");
      object.handleHeal(this.getData("power"));
      this.destroy();
      return;
    }

    crossSceneEventEmitter.emit(GLOBAL_CONSTANTS.PLAY_AUDIO, "damage-sfx");
    object.handleDamage(this.getData("power"));
    this.destroy();
  }
}