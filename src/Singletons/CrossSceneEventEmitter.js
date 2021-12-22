/**
 * Referencia: https://blog.ourcade.co/posts/2020/phaser3-how-to-communicate-between-scenes/
 */
import Phaser from "phaser";

const crossSceneEventEmitter = new Phaser.Events.EventEmitter();

export default crossSceneEventEmitter;