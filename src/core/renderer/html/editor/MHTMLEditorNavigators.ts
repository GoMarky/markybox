import { MObject } from '@/core/objects/MObject';
import { MHTMLEditorNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { CriticalError } from '@/base/errors';
import { MHTMLRenderer } from '@/core';
import { IPosition } from '@/core/app/common';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';

class MHTMLEditorNavigatorCommandManager extends MObject {
  constructor(private readonly renderer: MHTMLRenderer, private readonly navigators: Map<string, MHTMLEditorNavigator>) {
    super();
  }

  public enterSymbol(name: string, position: IPosition, char: MChar): void {
    let { row, column } = position;

    if (char === '\n') {
      const newRow = this.renderer.controller.addEmptyRow();

      row = newRow.index;
    } else {
      const matchedRow = this.renderer.storage.at(position.row);

      if (matchedRow) {
        matchedRow.inputAt(char, position.column);
      }
    }

    return this.with(name, (navigator) => {
      navigator.setPosition({ row, column: column + 1 });
    })
  }

  public changePosition(name: string, position: IPosition): void {
    return this.with(name, (navigator) => {
      navigator.setPosition(position);
    })
  }

  private with(name: string, callback: (navigator: MHTMLEditorNavigator) => void) {
    const navigator = this.navigators.get(name);

    return Reflect.apply(callback, undefined, [navigator]);
  }
}

export class MHTMLEditorNavigators extends MObject {
  private static MAX_NAVIGATORS_LENGTH = 6;

  public readonly commandCenter: MHTMLEditorNavigatorCommandManager;
  private readonly navigators: Map<string, MHTMLEditorNavigator> = new Map();

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.commandCenter = new MHTMLEditorNavigatorCommandManager(renderer, this.navigators);
  }

  public add(name: string): void {
    if (this.navigators.size >= MHTMLEditorNavigators.MAX_NAVIGATORS_LENGTH) {
      throw new CriticalError(`Maximum number of navigators reached. Current: ${this.navigators.size}`);
    }

    const navigator = new MHTMLEditorNavigator(this.renderer, name);

    this.navigators.set(name, navigator);
  }

  public remove(name: string): void {
    const navigator = this.navigators.get(name);

    if (!navigator) {
      throw new CriticalError(`Can find navigator with name - ${name}`);
    }

    navigator.dispose();
    this.navigators.delete(name);
  }
}
