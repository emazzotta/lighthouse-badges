import type { Spinner } from './types.js';

const GLYPHS = ['◜', '◠', '◝', '◞', '◡', '◟'] as const;
const FRAME_INTERVAL_MS = 70;
const LINE_START = '[0G';
const CLEAR_LINE = '[2K';
const BRIGHT_CYAN = '[96m';
const GREY = '[90m';
const RESET = '[0m';

interface SpinnerOptions {
  readonly write?: (text: string) => void;
  readonly intervalMs?: number;
}

export const createSpinner = (message: string, options: SpinnerOptions = {}): Spinner => {
  const write = options.write ?? ((text: string) => { process.stdout.write(text); });
  const intervalMs = options.intervalMs ?? FRAME_INTERVAL_MS;
  let timer: ReturnType<typeof setInterval> | undefined;
  let frame = 0;

  return {
    start: () => {
      timer = setInterval(() => {
        write(`${LINE_START}  ${BRIGHT_CYAN}${GLYPHS[frame % GLYPHS.length]} ${GREY}${message}${RESET}`);
        frame += 1;
      }, intervalMs);
    },
    stop: () => {
      clearInterval(timer);
      write(`${LINE_START}${CLEAR_LINE}`);
    },
  };
};
