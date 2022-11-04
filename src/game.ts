import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    ship: MatterJS.BodyType;

    create() {
        this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
        this.matter.world.setGravity(0, 1, 0.0001);

        this.ship = this.matter.add.rectangle(200, 300, 40, 20, {});
        this.ship.frictionAir = 0.005;

        this.keyLeft = this.input.keyboard.addKey("a");
        this.keyRight = this.input.keyboard.addKey("l");
    }

    update() {
        const thrust = 0.0002;
        if (this.keyLeft.isDown) {
            const force = this.matter.vector.rotate({ x: 0, y: -thrust }, this.ship.angle);
            const point = this.matter.vector.add(this.ship.position, this.matter.vector.rotate({ x: -10, y: 0 }, this.ship.angle));
            this.matter.body.applyForce(this.ship, point, force);
        }
        if (this.keyRight.isDown) {
            const force = this.matter.vector.rotate({ x: 0, y: -thrust }, this.ship.angle);
            const point = this.matter.vector.add(this.ship.position, this.matter.vector.rotate({ x: 10, y: 0 }, this.ship.angle));
            this.matter.body.applyForce(this.ship, point, force);
        }
    }
}
