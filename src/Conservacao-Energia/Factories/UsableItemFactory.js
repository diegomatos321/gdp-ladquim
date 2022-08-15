import Verniz from "../GameObjects/Usables/Verniz";
import Espanador from "../GameObjects/Usables/Espanador"
import Limpeza from "../GameObjects/Usables/Limpeza"
import Lixo from "../GameObjects/Usables/Lixo"

export default function UsableItemFactory(scene, x, y) {
    const collectableList = [
        
        "lixo"
    ];
    const randomUsable = Phaser.Utils.Array.GetRandom(collectableList);

    switch (randomUsable) {
        case "verniz":
            return new Verniz(scene, x, y);
        case "espanador":
            return new Espanador(scene,x,y);
        case "limpeza":
            return new Limpeza(scene,x,y);
        case "lixo":
            return new Lixo(scene,x,y);
        default:
            break;
    }
}