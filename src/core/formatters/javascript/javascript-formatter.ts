import { JavascriptKeyword } from '@/core/formatters/common';
import { BaseFormatter } from '@/core/formatters/formatter/base-formatter';
import { isEmptyString } from '@/base/string';

export const Regexp = {
  [JavascriptKeyword.Class]: /^(class$)/,
  [JavascriptKeyword.Function]: /^(function$)/,
  [JavascriptKeyword.Const]: /^(const$)/,
};


export class JavascriptCodeFormatter extends BaseFormatter {
  constructor() {
    super();
  }

  public static get formatterName(): string {
    return 'javascript';
  }

  public static parseKeywords(input: string) {
    const keywords = [];
    const words = input.split(/(\s+)/)

    for (const [index, word] of words.entries()) {
      let result = parseKeyword(word);

      keywords.push(result);
    }

    return keywords;
  }

  private static isFunctionKeyword(word: string): boolean {
    if (isEmptyString(word)) {
      return false;
    }

    const result = parseKeyword(word);

    return result?.keyword === JavascriptKeyword.Function;
  }


  private static isClassKeyword(word: string): boolean {
    if (isEmptyString(word)) {
      return false;
    }

    const result = parseKeyword(word);

    return result?.keyword === JavascriptKeyword.Class;
  }
}

function parseKeyword(word: string) {
  const classResult = Regexp.class.test(word);
  const functionResult = Regexp.function.test(word);
  const constResult = Regexp.const.test(word);

  let result;

  if (classResult) {
    result = {
      keyword: JavascriptKeyword.Class,
      className: 'm-editor__keyword-class',
      data: word,
    };
  } else if (functionResult) {
    result = {
      keyword: JavascriptKeyword.Function,
      className: 'm-editor__keyword-function',
      data: word,
    };
  } else if (constResult) {
    result = {
      keyword: JavascriptKeyword.Const,
      className: 'm-editor__keyword-default',
      data: word,
    }
  }

  return result;
}
