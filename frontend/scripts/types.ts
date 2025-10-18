export interface GameState {
  isPaused: boolean;
  isWin: boolean;
  leftScore: number;
  rightScore: number;
}

export interface GameConfig {
  readonly paddleWidth: number,
  readonly paddleHeight: number,
  readonly ballRadius: number,
  readonly maxScore: number,
  readonly ballInitSpeed: number
}

export interface Paddle {
  x: number,
  y: number,
  dy: number
}

export interface KeyMap {
  [myKey : string] : boolean
}

export interface Ball {
  radius: number,
  x : number,
  y: number,
  dx: number,
  dy: number
}

export interface ButtonRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TournamentSettings {
  numberOfPlayers: number,
  numberOfBots: number,
  playerAliases: string[]
}
