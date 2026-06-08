// Global declarations for logger helpers (used by editors/TS tooling)
// This file is safe in JS projects; it's picked up by tooling if included via jsconfig/tsconfig typeRoots or include

export {}; // ensure this is a module

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $logger:
    | {
        log: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        error: (...args: any[]) => void;
        crit: (...args: any[]) => void;
      }
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logger:
    | {
        log: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        error: (...args: any[]) => void;
        crit: (...args: any[]) => void;
      }
    | undefined;

  // Convenience global functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function $log(...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function $warn(...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function $error(...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function $crit(...args: any[]): void;
}
