import { isUndefinedOrNull } from '@/base/types';

export type Mime = 'text/plain';

export function removeLastLetter(text: string): string {
  if (isUndefinedOrNull(text)) {
    return '';
  }

  return text.slice(0, -1);
}

export function removeFirstLetter(text: string): string {
  if (isUndefinedOrNull(text)) {
    return '';
  }

  return text.slice(1);
}

export function getLastLetter(text: string): string {
  if (!text?.length) {
    return '';
  }

  return text[text.length - 1];
}

export function isEmptyString(str?: string): boolean {
  return str?.length === 0;
}

export function toUppercase(str?: string): string {
  if (!str) {
    return '';
  }

  return str.toUpperCase();
}

export function toLowerCase(str?: string): string {
  if (!str) {
    return '';
  }

  return str.toLowerCase();
}

export function ensureEndSlash(string: string) {
  return string.endsWith('/') ? string : `${string}/`;
}

export function ensureNoFirstSlash(str: string): string {
  if (str === '/') {
    return '/';
  }

  return str[0] === '/' ? str.slice(1) : str;
}

export function isLeftParen(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === '[' || char === '{';
}

export function isRightParen(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === ']' || char === '}';
}
