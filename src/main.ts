import Phaser from "phaser";

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("autoreload")) {
        const script = document.createElement("script");
        script.src = "https://livejs.com/live.js";
        document.head.appendChild(script);
    }

    new Phaser.Game({
        width: 800,
        height: 600,
        backgroundColor: "#208080",
        physics: {
            default: "matter",
            matter: { debug: true, enableSleeping: true }
        }
    });
}
