import { Scene, World, Entity } from "@waldrumpus/orb";
import { Visual, Movement } from "./components";

export class IslandsScene implements Scene {
  private readonly world = new World();
  readonly width: number;
  readonly height: number;
  private readonly entities: Entity[] = [];
  private readonly boatVisual = new Visual("assets/boat.png");
  private readonly waterVisual = new Visual("assets/water1.png");

  cloudSpawnTimer = 3;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    const boat = this.world.create();
    this.world.add(boat, this.boatVisual);
    this.world.add(boat, new Movement(3, 2));
  }

  update(dt: number): void {
    this.cloudSpawnTimer -= dt;
    if (this.cloudSpawnTimer <= 0) {
      this.spawnCloud();
      this.cloudSpawnTimer = 2 + Math.random() * 6;
    }

    this.world.each(Visual, Movement, (e, v, m) => {
      v.x += m.vx * dt;
      v.y += m.vy * dt;
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    const boat = this.boatVisual.sprite;

    const halfWidth = boat.ready ? boat.width / boat.frameCount / 2 : 8;
    const halfHeight = boat.ready ? boat.height : 8;

    const cameraX = boat.x + halfWidth - this.width / 2;
    const cameraY = boat.y + halfHeight - this.height / 2;

    ctx.save();
    ctx.translate(-Math.round(cameraX), -Math.round(cameraY));

    const tileSize = 16;
    const startX = Math.floor(cameraX / tileSize) * tileSize;
    const startY = Math.floor(cameraY / tileSize) * tileSize;

    for (let y = startY; y < cameraY + this.height; y += tileSize) {
      for (let x = startX; x < cameraX + this.width; x += tileSize) {
        this.waterVisual.x = x;
        this.waterVisual.y = y;
        this.waterVisual.render(ctx);
      }
    }

    this.world.each(Visual, Visual, (_e, v1, _v2) => {
      v1.render(ctx);
    });

    ctx.restore();
  }

  private spawnCloud(): void {
    const cloud = this.world.create();
    const visual = new Visual("assets/cloud.png");

    visual.x = Math.random() * 160 - 80;
    visual.y = -16;

    this.world.add(cloud, visual);
    this.world.add(cloud, new Movement(6, 6));
  }
}
