import AdversityRain from "../GameObjects/Adversities/AdversityRain";
import AdversitySun from "../GameObjects/Adversities/AdversitySun";

export default function AdversityFactory(scene, x, y) {
    const adversityList = [
        "rain",
        "strong-sun"
    ]

    const randomAdversity = Phaser.Utils.Array.GetRandom(adversityList);

    switch (randomAdversity) {
        case "rain":
            return new AdversityRain(scene, x, scene.game.config.height / 2, "nuvem", "rain-sfx");
    
        case "strong-sun":
            return new AdversitySun(scene, x, scene.game.config.height / 2, "sol", "sun-birds-sfx");
    }
}