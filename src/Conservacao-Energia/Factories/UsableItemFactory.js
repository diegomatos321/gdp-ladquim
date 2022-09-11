import Verniz from "../GameObjects/Usables/Verniz";
import Espanador from "../GameObjects/Usables/Espanador"
import Limpeza from "../GameObjects/Usables/Limpeza"
import Lixo from "../GameObjects/Usables/Lixo"

export default function UsableItemFactory(scene, x, y, itemName = null) {
    const collectableList = [
        "verniz",
        "espanador",
        "limpeza",
        "lixo"
    ];
    if (itemName == null) {
        itemName = Phaser.Utils.Array.GetRandom(collectableList);
    }

    switch (itemName) {
        case "verniz":
            return new Verniz(scene, x, y);
        case "espanador":
            return new Espanador(scene,x,y);
        case "limpeza":
            return new Limpeza(scene,x,y);
        case "lixo":
            return new Lixo(scene,x,y);
        default:
            return new Verniz(scene, x, y);
    }
}