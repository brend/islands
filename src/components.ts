import { Sprite as OrbSprite } from "@waldrumpus/orb";

export class Position {
  constructor(
    public x = 0,
    public y = 0,
  ) {}
}

export class Size {
  constructor(
    public width: number,
    public height: number,
  ) {}
}

export class Sprite {
  private readonly sprite: OrbSprite;

  constructor(spritesheet: string, frameCount = 1) {
    this.sprite = new OrbSprite(spritesheet, frameCount);
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.render(ctx);
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
