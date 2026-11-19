import { World, Entity } from "@waldrumpus/orb";
import { Lifetime, Movement, Position, Size, Sprite } from "./components";

export function spawn(world: World, ...components: object[]): Entity {
  const e = world.create();
  for (const c of components) {
    world.add(e, c);
  }
  return e;
}

export function spawnBoat(world: World): Entity {
  return spawn(
    world,
    new Sprite("assets/boat.png"),
    new Movement(3, 2),
    new Position(0, 0),
    new Size(16, 16),
  );
}

export function spawnCloud(world: World): Entity {
  return spawn(
    world,
    new Sprite("assets/cloud.png"),
    new Position(Math.random() * 160 - 80, -16),
    new Size(16, 16),
    new Movement(6, 6),
    new Lifetime(),
  );
}
