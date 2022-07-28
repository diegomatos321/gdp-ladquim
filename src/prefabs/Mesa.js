import Phaser from "phaser"
import CONSTANTS from "../constants.json"

const Mesa = (scene, x, y) => {

    let mesa

    init = (x, y) => {
        preload()
        create(x, y)
        return mesa
    }

    preload = () => {
        scene.load.image("mesa", new URL("../images/desk-sprite.png?as=webp&quality=75&width=300", import.meta.url).pathname);
    }

    create = () => {
        mesa = scene.physics.add.staticImage(x, y, "mesa");
        mesa.body.setSize(mesa.displayWidth, mesa.displayHeight/3, true);
    }

    return init(x, y)

}

export default Mesa