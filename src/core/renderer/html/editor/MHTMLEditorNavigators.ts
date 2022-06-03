import { MObject } from '@/core/objects/MObject';
import { MHTMLEditorNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { CriticalError } from '@/base/errors';
import { IPosition } from '@/core/app/common';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';

class MHTMLEditorNavigatorCommandManager extends MObject {
  constructor(
    private readonly navigatorManager: MHTMLEditorNavigators,
    private readonly controller: MHTMLEditorController,
    private readonly storage: MHTMLStorage,
    private readonly navigators: Map<string, MHTMLEditorNavigator>) {
    super();
  }

  public enterSymbol(name: string, position: IPosition, char: MChar): void {
    const { controller, storage } = this;
    let { row, column } = position;

    if (char === '\n') {
      const newRow = controller.addEmptyRow();

      row = newRow.index;
    } else {
      const matchedRow = storage.at(position.row);

      if (matchedRow) {
        matchedRow.inputAt(char, position.column);
      }
    }

    return this.with(name, (navigator) => {
      navigator.setPosition({ row, column: column + 1 });
    })
  }

  public changePosition(name: string, position: IPosition): void {
    return this.with(name, (navigator) => navigator.setPosition(position))
  }

  private with(name: string, callback: (navigator: MHTMLEditorNavigator) => void): void {
    const navigator = this.navigators.get(name);

    if (!navigator) {
      this.navigatorManager.add(name);
      return this.with(name, callback);
    }

    return Reflect.apply(callback, undefined, [navigator]);
  }
}

export class MHTMLEditorNavigators extends MObject {
  private static MAX_NAVIGATORS_LENGTH = 6;

  public readonly commandCenter: MHTMLEditorNavigatorCommandManager;
  private readonly navigators: Map<string, MHTMLEditorNavigator> = new Map();

  constructor(
    private readonly controller: MHTMLEditorController,
    private readonly display: MHTMLDisplayRenderer,
    private readonly storage: MHTMLStorage) {
    super();

    this.commandCenter = new MHTMLEditorNavigatorCommandManager(this, controller, storage, this.navigators);
  }

  public add(name: string): void {
    if (this.navigators.size >= MHTMLEditorNavigators.MAX_NAVIGATORS_LENGTH) {
      throw new CriticalError(`Maximum number of navigators reached. Current: ${this.navigators.size}`);
    }

    const navigator = new MHTMLEditorNavigator(this.display, this.storage, name);

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
