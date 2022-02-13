import { isUndefinedOrNull } from '@/base/types';

export function removeLastLetter(text: string): string {
  if (isUndefinedOrNull(text)) {
    return '';
  }

  return text.slice(0, -1);
}
