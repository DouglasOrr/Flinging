import Phaser from "phaser";

const CONFIG = {
    ship: {
        width: 30,
        height: 15,
        frictionAir: 0.01,
        mass: 1.0,
        thrust: {
            main: 0.0004,
            hRatio: 0.2,
            offsetRatio: 0.15,
        },
        sling: {
            nLinks: 5,
            stiffness: 0.9,
            thickness: 5,
            mass: 0.01,
        },
        start: { x: 200, y: 400 },
    },
    bomb: {
        radius: 10,
        frictionAir: 0,
        gravityScale: 0.5,
        restitution: 0.5,
        mass: 0.03,
    },
};

const FILTER_SHIP = { group: 0, category: 0b0010, mask: 0b1101 };
const FILTER_BOMB = { group: 0, category: 0b0100, mask: 0b1111 };

function createShip(matter: Phaser.Physics.Matter.MatterPhysics): MatterJS.BodyType {
    const c = CONFIG.ship;

    const ship = matter.add.fromVertices(
        c.start.x,
        c.start.y,
        [
            [
                { x: -c.width, y: -c.height },
                { x: -c.width / 2, y: c.height / 2 },
                { x: c.width / 2, y: c.height / 2 },
                { x: c.width, y: -c.height },
                { x: c.width, y: c.height },
                { x: -c.width, y: c.height },
            ],
        ],
        { restitution: 0, frictionAir: c.frictionAir, mass: c.mass, collisionFilter: FILTER_SHIP }
    );

    const chainLinkLength = (2 * c.width) / c.sling.nLinks;
    const stack = matter.add.stack(
        c.start.x - c.width,
        c.start.y - c.height - ship.centerOffset.y,
        c.sling.nLinks,
        1,
        0,
        0,
        (x: number, y: number) => {
            return matter.bodies.rectangle(x, y - c.sling.thickness, chainLinkLength, c.sling.thickness, {
                collisionFilter: FILTER_SHIP,
                mass: c.sling.mass / c.sling.nLinks,
            });
        }
    );
    const chain = matter.add.chain(stack, 0.5, 0, -0.5, 0, { stiffness: c.sling.stiffness, length: 0 });
    matter.add.constraint(ship, chain.bodies[0], 0, c.sling.stiffness, {
        pointA: { x: -c.width, y: -c.height - ship.centerOffset.y },
        pointB: { x: -chainLinkLength / 2, y: 0 },
    });
    matter.add.constraint(ship, chain.bodies[chain.bodies.length - 1], 0, c.sling.stiffness, {
        pointA: { x: c.width, y: -c.height - ship.centerOffset.y },
        pointB: { x: chainLinkLength / 2, y: 0 },
    });

    return ship;
}

function createBomb(matter: Phaser.Physics.Matter.MatterPhysics): MatterJS.BodyType {
    const c = CONFIG.bomb;
    return matter.add.circle(CONFIG.ship.start.x, CONFIG.ship.start.y - 50, c.radius, {
        mass: c.mass,
        frictionAir: c.frictionAir,
        restitution: c.restitution,
        gravityScale: { x: c.gravityScale, y: c.gravityScale },
        collisionFilter: FILTER_BOMB,
    });
}

function updateShip(
    matter: Phaser.Physics.Matter.MatterPhysics,
    ship: MatterJS.BodyType,
    left: boolean,
    right: boolean
) {
    const c = CONFIG.ship;
    const hThrust = c.thrust.main * c.thrust.hRatio;
    const offset = c.thrust.offsetRatio * c.width;
    if (left) {
        const force = matter.vector.rotate({ x: -hThrust, y: -c.thrust.main }, ship.angle);
        const point = matter.vector.add(ship.position, matter.vector.rotate({ x: -offset, y: 0 }, ship.angle));
        matter.body.applyForce(ship, point, force);
    }
    if (right) {
        const force = matter.vector.rotate({ x: hThrust, y: -c.thrust.main }, ship.angle);
        const point = matter.vector.add(ship.position, matter.vector.rotate({ x: offset, y: 0 }, ship.angle));
        matter.body.applyForce(ship, point, force);
    }
}

export default class MainScene extends Phaser.Scene {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    ship: MatterJS.BodyType;
    bomb: MatterJS.BodyType;

    create() {
        this.matter.world.setBounds(10, 10, 1180, 780, 10, true, true, false, true);
        this.matter.world.setGravity(0, 1, 0.0002);

        this.ship = createShip(this.matter);
        this.bomb = createBomb(this.matter);

        this.keyLeft = this.input.keyboard.addKey("a");
        this.keyRight = this.input.keyboard.addKey("l");

        this.matter.world.autoUpdate = false;
        // this.cameras.main.setZoom(3, 3);
        // this.cameras.main.centerOn(shipStartX, shipStartY);
    }

    update() {
        updateShip(this.matter, this.ship, this.keyLeft.isDown, this.keyRight.isDown);
        this.matter.world.step();
    }
}
