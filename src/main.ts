import Phaser from "phaser";
import MainScene from "./game";

window.onload = () => {
    // const params = new URLSearchParams(window.location.search);

    new Phaser.Game({
        width: 1200,
        height: 800,
        backgroundColor: "#000000",
        physics: {
            default: "matter",
            matter: { debug: true, enableSleeping: true }
        },
        scene: MainScene
    });
}
