import { BaseObject } from '@/core/objects/BaseObject';
import { EditorLang } from '@/core';
import { EditorBodyNavigator } from '@/core/renderer/html/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/html/editor/EditorRowsController';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export enum CodeStatement {
  Text = 'text',
  VariableDeclaration = 'VariableDeclaration',
}

export abstract class BaseFormatter extends BaseObject {
  public abstract readonly applicator: IAbstractKeyApplicator;
  public abstract readonly factory: IAbstractFormatterFactory;

  protected constructor(public readonly name: EditorLang) {
    super();
  }

  public abstract parseKeyword(input: string): CodeStatement | undefined;

  public setContext(navigator: EditorBodyNavigator, controller: EditorRowsController): void {
    this.applicator.setContext(navigator, controller);
  }

  public toString(): string {
    return this.name;
  }
}
