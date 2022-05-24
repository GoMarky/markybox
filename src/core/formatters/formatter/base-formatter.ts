import { MObject } from '@/core/objects/MObject';
import { EditorLang } from '@/core';

export enum CodeStatement {
  Text = 'text',
  VariableDeclaration = 'VariableDeclaration',
}

export abstract class BaseFormatter extends MObject {
  protected constructor(private readonly _name: EditorLang) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  public abstract parseKeyword(input: string): CodeStatement | undefined;
}
