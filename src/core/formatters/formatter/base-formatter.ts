import { MObject } from '@/core/objects/MObject';
import { EditorLang } from '@/core';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';

export enum CodeStatement {
  Text = 'text',
  VariableDeclaration = 'VariableDeclaration',
}

export interface IAbstractKeyApplicator {
  backspace(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void;

  enter(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void;
}

export abstract class BaseFormatter extends MObject {
  public abstract readonly applicator: IAbstractKeyApplicator;

  protected constructor(private readonly _name: EditorLang) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  public abstract parseKeyword(input: string): CodeStatement | undefined;

  public toString(): string {
    return this._name;
  }
}
