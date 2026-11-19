import { Scene, World, Entity } from "@waldrumpus/orb";
import { Visual, Movement, Lifetime } from "./components";

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
    const deferred: Array<() => void> = [];

    this.cloudSpawnTimer -= dt;
    if (this.cloudSpawnTimer <= 0) {
      this.spawnCloud();
      this.cloudSpawnTimer = 2 + Math.random() * 6;
    }

    this.world.each([Visual, Movement], (_, v, m) => {
      v.x += m.vx * dt;
      v.y += m.vy * dt;
    });

    this.world.each([Lifetime], (_, l) => (l.time += dt));

    this.world.each([Visual, Lifetime], (e, v, l) => {
      if (this.isOffscreen(v) && l.time > 10) {
        deferred.push(() => {
          console.log("destroy", e);
          this.world.destroy(e);
        });
      }
    });

    for (const command of deferred) {
      command();
    }
  }

  private getCamera(): { x: number; y: number } {
    const boat = this.boatVisual.sprite;

    const halfWidth = boat.ready ? boat.width / boat.frameCount / 2 : 8;
    const halfHeight = boat.ready ? boat.height : 8;

    return {
      x: boat.x + halfWidth - this.width / 2,
      y: boat.y + halfHeight - this.height / 2,
    };
  }

  private isOffscreen(visual: Visual): boolean {
    const sprite = visual.sprite;
    const camera = this.getCamera();

    const w = sprite.ready ? sprite.width / sprite.frameCount : 0;
    const h = sprite.ready ? sprite.height : 0;

    return (
      visual.x + w < camera.x ||
      visual.x > camera.x + this.width ||
      visual.y + h < camera.y ||
      visual.y > camera.y + this.height
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x: cameraX, y: cameraY } = this.getCamera();

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

    this.world.each([Visual], (_, v) => {
      v.render(ctx);
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
    this.world.add(cloud, new Lifetime());
  }
}
