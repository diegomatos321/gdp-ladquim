import Verniz from "../Objects/Verniz";

export default function CollectableItemFactory(scene, x, y) {
    const collectableList = [
        "verniz"
    ];
    const randomCollectable = Phaser.Utils.Array.GetRandom(collectableList);

    switch (randomCollectable) {
        case "verniz":
            return new Verniz(scene, x, y)
    
        default:
            break;
    }
}