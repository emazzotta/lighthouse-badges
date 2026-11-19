import type { Spinner } from './types.js';

const GLYPHS = ['◜', '◠', '◝', '◞', '◡', '◟'] as const;
const FRAME_INTERVAL_MS = 70;
const LINE_START = '\x1b[0G';
const CLEAR_LINE = '\x1b[2K';
const BRIGHT_CYAN = '\x1b[96m';
const GREY = '\x1b[90m';
const RESET = '\x1b[0m';

interface SpinnerOptions {
  readonly write?: (text: string) => void;
  readonly intervalMs?: number;
  readonly isTTY?: boolean;
}

const SILENT_SPINNER: Spinner = { start: () => {}, stop: () => {} };

export const createSpinner = (message: string, options: SpinnerOptions = {}): Spinner => {
  if (!(options.isTTY ?? process.stdout.isTTY === true)) {
    return SILENT_SPINNER;
  }
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
