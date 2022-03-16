import { IParsedFormatterWord, JavascriptKeyword, KeywordClassName } from '@/core/formatters/common';
import { BaseFormatter } from '@/core/formatters/formatter/base-formatter';
import { isEmptyString } from '@/base/string';

export const Regexp = {
  [JavascriptKeyword.Class]: /^(class$)/,
  [JavascriptKeyword.Function]: /^(function$)/,
  [JavascriptKeyword.Const]: /^(const$)/,
  [JavascriptKeyword.Whitespace]: /^\s*$/,
};


export class JavascriptCodeFormatter extends BaseFormatter {
  constructor() {
    super();
  }

  public static get formatterName(): string {
    return 'javascript';
  }

  public static parseKeywords(input: string): IParsedFormatterWord[] {
    const keywords: IParsedFormatterWord[] = [];
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

    return result.keyword === JavascriptKeyword.Function;
  }


  private static isClassKeyword(word: string): boolean {
    if (isEmptyString(word)) {
      return false;
    }

    const result = parseKeyword(word);

    return result.keyword === JavascriptKeyword.Class;
  }
}

function parseKeyword(word: string): IParsedFormatterWord {
  const classResult = Regexp.class.test(word);
  const functionResult = Regexp.function.test(word);
  const constResult = Regexp.const.test(word);

  const isWhitespace = word.trim().length === 0;

  let result: IParsedFormatterWord;

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
  } else if (isWhitespace) {
    result = {
      keyword: JavascriptKeyword.Whitespace,
      className: 'm-editor__plain',
      data: word,
    }
  } else {
    result = {
      keyword: JavascriptKeyword.Plain,
      className: 'm-editor__plain',
      data: word,
    }
  }

  return result;
}
