import { isUndefinedOrNull } from '@/base/types';

export function removeLastLetter(text: string): string {
  if (isUndefinedOrNull(text)) {
    return '';
  }

  return text.slice(0, -1);
}

export function isEmptyString(str?: string): boolean {
  return str?.length === 0;
}
