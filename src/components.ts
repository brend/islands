import { Sprite } from "@waldrumpus/orb";

export class Visual {
  sprite: Sprite;

  constructor(spritesheet: string, frameCount = 1) {
    this.sprite = new Sprite(spritesheet, frameCount);
  }
  render(ctx: CanvasRenderingContext2D): void {
    this.sprite.render(ctx);
  }
  get x(): number {
    return this.sprite.x;
  }
  set x(x: number) {
    this.sprite.x = x;
  }
  get y(): number {
    return this.sprite.y;
  }
  set y(y: number) {
    this.sprite.y = y;
  }
  get width(): number {
    return this.sprite.ready ? this.sprite.w : 8;
  }
  get height(): number {
    return this.sprite.ready ? this.sprite.h : 8;
  }
}

export class Movement {
  constructor(
    public vx: number,
    public vy: number,
  ) {}
}

export class Lifetime {
  time: number = 0;
}
