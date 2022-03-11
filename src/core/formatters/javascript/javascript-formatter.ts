import { IParsedFormatterWord, KeywordClassName, JavascriptKeyword } from '@/core/formatters/common';
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

  public static parseKeywords(input: string): IParsedFormatterWord[] {
    const keywords: IParsedFormatterWord[] = [];
    const words = input.split(' ');

    for (const [index, word] of words.entries()) {
      let result = parseKeyword(word);

      const previousWord = words[index - 1];

      const isPreviousWordFunction = JavascriptCodeFormatter.isFunctionKeyword(previousWord);
      const isPreviousWordClass = JavascriptCodeFormatter.isClassKeyword(previousWord);

      if (isPreviousWordClass || isPreviousWordFunction) {
        const className: KeywordClassName = isPreviousWordClass ? 'm-editor__keyword-class-name' : 'm-editor__keyword-function-name';

        result = {
          keyword: JavascriptKeyword.Identifier,
          className,
          data: result.data
        }
      }

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

  let result: IParsedFormatterWord;

  if (classResult) {
    result = {
      keyword: JavascriptKeyword.Class,
      className: 'm-editor__keyword-class',
      data: word + ' ',
    };
  } else if (functionResult) {
    result = {
      keyword: JavascriptKeyword.Function,
      className: 'm-editor__keyword-function',
      data: word + ' ',
    };
  } else if (constResult) {
    result = {
      keyword: JavascriptKeyword.Const,
      className: 'm-editor__keyword-default',
      data: word + ' ',
    }
  } else {
    result = {
      keyword: JavascriptKeyword.Plain,
      className: 'm-editor__plain',
      data: word + ' ',
    }
  }

  return result;
}
