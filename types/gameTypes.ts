export interface ControlsInterface {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  respawn: boolean;
}

export interface Jumps {
  1: boolean;
  2: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  colour: string;
  jumps: Jumps;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Coin {
  x: number;
  y: number;
}

export interface Collidable {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  height: number;
  width: number;
}
