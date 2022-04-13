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

  return text.at(-1) as string;
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

  return char === '[' || char === '{' || char === '(';
}

function isRightParen(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === ']' || char === '}' || char === ')';
}

export function isParen(char?: string): boolean {
  if (!char) {
    return false;
  }

  return isLeftParen(char) || isRightParen(char);
}

export function containsParen(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    if (isParen(text.charAt(i))) {
      return true;
    }
  }

  return false;
}
