import { Engine } from "@waldrumpus/orb";
import { IslandsScene } from "./IslandsScene";

const scene = new IslandsScene(320, 180);
const engine = new Engine(320, 180, scene, false, "Islands", 5);

// Explicitly load the canvas font; CSS font-face declarations alone do not load it.
// The fallback keeps the game playable if a font request fails.
document.fonts.load('8px "Dogica Pixel"').catch((error: unknown) => {
  console.warn("Could not load the game font:", error);
});

(window as any).game = engine;

engine.start();
