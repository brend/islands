import { Scene, World, Entity } from "@waldrumpus/orb";
import { Sprite, Position, Movement, Lifetime, Size } from "./components";
import { spawnBoat, spawnCloud } from "./entities";

export class IslandsScene implements Scene {
  private readonly world = new World();
  readonly width: number;
  readonly height: number;
  private readonly boat: Entity;
  private readonly waterSprite = new Sprite("assets/water1.png");

  cloudSpawnTimer = 3;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.boat = spawnBoat(this.world);
  }

  update(dt: number): void {
    const deferred: Array<() => void> = [];

    this.cloudSpawnTimer -= dt;
    if (this.cloudSpawnTimer <= 0) {
      spawnCloud(this.world);
      this.cloudSpawnTimer = 2 + Math.random() * 6;
    }

    this.world.each([Position, Movement], (_, v, m) => {
      v.x += m.vx * dt;
      v.y += m.vy * dt;
    });

    this.world.each([Lifetime], (_, l) => (l.time += dt));

    this.world.each([Position, Size, Lifetime], (e, p, s, l) => {
      if (this.isOffscreen(p, s) && l.time > 10) {
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
    const position = this.world.get(this.boat, Position)!;
    const size = this.world.get(this.boat, Size)!;
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;

    return {
      x: position.x + halfWidth - this.width / 2,
      y: position.y + halfHeight - this.height / 2,
    };
  }

  private isOffscreen(position: Position, size: Size): boolean {
    const camera = this.getCamera();

    const w = size.width;
    const h = size.height;

    return (
      position.x + w < camera.x ||
      position.x > camera.x + this.width ||
      position.y + h < camera.y ||
      position.y > camera.y + this.height
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
        this.waterSprite.render(ctx, x, y);
      }
    }

    this.world.each([Position, Sprite], (_, p, v) => {
      v.render(ctx, p.x, p.y);
    });

    ctx.restore();
  }
}
