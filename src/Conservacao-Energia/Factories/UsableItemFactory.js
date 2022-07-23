import Verniz from "../GameObjects/Usables/Verniz";

export default function UsableItemFactory(scene, x, y) {
    const collectableList = [
        "verniz"
    ];
    const randomUsable = Phaser.Utils.Array.GetRandom(collectableList);

    switch (randomUsable) {
        case "verniz":
            return new Verniz(scene, x, y)
    
        default:
            break;
    }
}