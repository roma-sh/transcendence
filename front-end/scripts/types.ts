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
