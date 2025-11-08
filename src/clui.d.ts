declare module 'clui' {
  export class Spinner {
    constructor(message: string, frames: string[]);
    start(): void;
    stop(): void;
  }
}

