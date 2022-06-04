import { MObject } from '@/core/objects/MObject';
import { EditorLang } from '@/core';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export enum CodeStatement {
  Text = 'text',
  VariableDeclaration = 'VariableDeclaration',
}

export abstract class BaseFormatter extends MObject {
  public abstract readonly applicator: IAbstractKeyApplicator;
  public abstract readonly factory: IAbstractFormatterFactory;

  protected constructor(public readonly name: EditorLang) {
    super();
  }

  public abstract parseKeyword(input: string): CodeStatement | undefined;

  public setContext(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
    this.applicator.setContext(navigator, controller);
  }

  public toString(): string {
    return this.name;
  }
}
