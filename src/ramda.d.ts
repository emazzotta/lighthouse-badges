declare module 'ramda' {
  export function head<T>(list: T[]): T | undefined;
  export function keys<T extends Record<string, unknown>>(obj: T): string[];
  export function map<T, U>(fn: (item: T) => U, list: T[]): U[];
  export function map<T, U>(fn: (item: T) => U): (list: T[]) => U[];
  export function pluck<K extends string, T extends Record<K, unknown>>(key: K, list: T[]): T[K][];
  export function pluck<K extends string>(key: K): <T extends Record<K, unknown>>(list: T[]) => T[K][];
  export function sum(list: number[]): number;
  export function length<T>(list: T[]): number;
  export function mergeAll<T extends Record<string, unknown>>(list: T[]): T;
  export function values<T extends Record<string, unknown>>(obj: T): T[keyof T][];
  export function pipe<T1, T2, T3, T4, T5>(
    fn1: (x: T1) => T2,
    fn2: (x: T2) => T3,
    fn3: (x: T3) => T4,
    fn4: (x: T4) => T5
  ): (x: T1) => T5;
  export function pipe<T1, T2, T3, T4>(
    fn1: (x: T1) => T2,
    fn2: (x: T2) => T3,
    fn3: (x: T3) => T4
  ): (x: T1) => T4;
  export function pipe<T1, T2, T3>(
    fn1: (x: T1) => T2,
    fn2: (x: T2) => T3
  ): (x: T1) => T3;
  export function pipe<T1, T2>(
    fn1: (x: T1) => T2
  ): (x: T1) => T2;
  export function curry<T extends (...args: unknown[]) => unknown>(fn: T): T;
}

