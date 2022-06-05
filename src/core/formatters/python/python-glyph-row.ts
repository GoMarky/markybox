import { GlyphRowElement } from '@/core/renderer/html/common/GlyphRowElement';
import * as string from '@/base/string';
import { CriticalError } from '@/base/errors';
import { IInputParseResult } from '@/core/renderer/html/common/GlyphRowElement';

export class PythonGlyphRow extends GlyphRowElement {
  constructor() {
    super();
  }

  protected parseWord(word: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const chars = word.split('');

    let tempString = '';

    while (chars.length) {
      const currentChar = chars.shift();

      if (!currentChar) {
        throw new CriticalError(`MHTMLGlyphRow.parseWord - expected currentChar to be defined.`);
      }

      if (string.isDot(currentChar) || string.isColon(currentChar)) {
        if (tempString.length) {
          result.push({ type: 'text', data: tempString });
          tempString = '';
        }

        result.push({ type: 'paren', data: currentChar })
      } else {
        tempString += currentChar;
      }
    }

    if (tempString.length) {
      result.push({
        type: 'text',
        data: tempString,
      })
    }

    return result;
  }

  protected parseText(text: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const words = text.split(/(\s+)/);

    let currentPosition = 0;

    for (const word of words) {
      const isWhitespace = word.trim().length === 0;
      const startColumn = currentPosition;

      currentPosition += word.length;
      const endColumn = currentPosition;

      let type: IInputParseResult['type'];

      switch (true) {
        case isWhitespace:
          type = 'whitespace';
          break;
        case string.isParen(word):
          type = 'paren'
          break;
        default: {
          if (string.containsDot(word) || string.containsColon(word)) {
            result.push(...this.parseWord(word));
            continue;
          }

          type = 'text';
          break;
        }
      }

      result.push({
        startColumn,
        endColumn,
        type,
        data: word,
      });
    }

    return result;
  }
}
