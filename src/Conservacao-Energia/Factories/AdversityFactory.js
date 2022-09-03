import AdversityRain from "../GameObjects/Adversities/AdversityRain";
import AdversitySun from "../GameObjects/Adversities/AdversitySun";
import AdversityFire from "../GameObjects/Adversities/AdversityFire";
import AdversityFood from "../GameObjects/Adversities/AdversityFood";
import AdversityWater from "../GameObjects/Adversities/AdversityWater";


export default function AdversityFactory(scene, x, y) {
    const adversityList = [
        "rain",
        "strong-sun",
        "fire",
        "food",
        "water"
    ]

    const randomAdversity = Phaser.Utils.Array.GetRandom(adversityList);

    switch (randomAdversity) {
        case "rain":
            return new AdversityRain(scene, x, scene.game.config.height / 2, "nuvem", "rain-sfx");
        case "strong-sun":
            return new AdversitySun(scene, x, scene.game.config.height / 2, "sol", "sun-birds-sfx");
        case "fire":
            return new AdversityFire(scene,scene.game.config.width / 2,scene.game.config.height - 200, "fogo", "fire-sfx")
        case "food":
            return new AdversityFood(scene,scene.game.config.width / 2,scene.game.config.height - 200, "lixo-comida", "garbage-sfx")
        case "water":
            return new AdversityWater(scene,scene.game.config.width / 2,scene.game.config.height - 200, "folhas", "water-sfx")
        default:
            break;
    }
}