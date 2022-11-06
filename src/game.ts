import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    ship: MatterJS.BodyType;
    ball: MatterJS.BodyType;

    create() {
        this.matter.world.setBounds(10, 10, 1180, 780, 10, true, true, false, true);
        this.matter.world.setGravity(0, 1, 0.0002);

        const width = 30;
        const height = 10;
        this.ship = this.matter.add.fromVertices(200, 400, [[
            { x: -width, y: -height },
            { x: 0, y: 0 },
            { x: width, y: -height },
            { x: width, y: height },
            { x: -width, y: height },
        ]]);
        this.ship.frictionAir = 0.01;
        this.ship.restitution = 0.0;

        this.ball = this.matter.add.circle(200, 300, 5);
        this.ball.frictionAir = 0.0;
        this.ball.gravityScale.y = 0.5;
        this.ball.restitution = 0.5;

        this.keyLeft = this.input.keyboard.addKey("a");
        this.keyRight = this.input.keyboard.addKey("l");
    }

    update() {
        const thrust = 0.0003;
        const offset = 6;
        if (this.keyLeft.isDown) {
            const force = this.matter.vector.rotate({ x: 0, y: -thrust }, this.ship.angle);
            const point = this.matter.vector.add(this.ship.position, this.matter.vector.rotate({ x: -offset, y: 0 }, this.ship.angle));
            this.matter.body.applyForce(this.ship, point, force);
        }
        if (this.keyRight.isDown) {
            const force = this.matter.vector.rotate({ x: 0, y: -thrust }, this.ship.angle);
            const point = this.matter.vector.add(this.ship.position, this.matter.vector.rotate({ x: offset, y: 0 }, this.ship.angle));
            this.matter.body.applyForce(this.ship, point, force);
        }
    }
}
