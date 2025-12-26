
export interface MemoryPhoto {
  id: string;
  url: string;
  base64: string;
  x: number;
  y: number;
  rotation: number;
  month: number;
}

export enum AppState {
  LANDING = 'LANDING',
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  REVEALED = 'REVEALED'
}
