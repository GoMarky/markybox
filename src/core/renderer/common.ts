import { Char } from '@/base/char';

export interface IPosition {
  row: number;
  column: number;
}

export function isSystemChar(code: Char): boolean {
  return Object.values(Char).includes(code);
}
