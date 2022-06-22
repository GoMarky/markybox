import windowShortcut from '@gomarky/window-shortcut';
import { BaseObject } from '@/core/objects/BaseObject';
import { EditorBodyNavigator } from '@/core/renderer/html/editor/EditorBodyNavigator';
import { EditorDisplayController } from '@/core/renderer/html/system/EditorDisplayController';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/EditorBodyContainer';
import { UserClipboardController } from '@/core/renderer/html/system/UserClipboardController';
import { EditorSelectionContainer } from '@/core/renderer/html/editor/EditorSelectionContainer';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';
import { EditorActiveState } from '@/core/renderer/html/state/EditorActiveState';
import { AbstractEditorState } from '@/core/renderer/html/state/AbstractEditorState';
import { EditorLockedState } from '@/core/renderer/html/state/EditorLockedState';
import { CriticalError } from '@/base/errors';
import { EditorRowsController } from '@/core/renderer/html/editor/EditorRowsController';
import { UserTextHintVisitor } from '@/core/renderer/html/visitors/UserTextHintVisitor';
import { KeywordCheckerVisitor } from '@/core/renderer/html/visitors/KeywordCheckerVisitor';
import { EditorSimpleNavigator } from '@/core/renderer/html/editor/EditorSimpleNavigator';
import { IAbstractRenderer } from '@/core/app/renderer';
import { toDisposable } from '@/platform/lifecycle/common/lifecycle';

export class HTMLRenderer extends BaseObject implements IAbstractRenderer {
  public readonly storage: EditorStorage;
  public readonly clipboard: UserClipboardController;
  public readonly selection: EditorSelectionContainer;
  public readonly navigatorManager: EditorSimpleNavigator;
  public readonly display: EditorDisplayController;
  public readonly navigator: EditorBodyNavigator;
  public readonly controller: EditorRowsController;
  public readonly body: MHTMLEditorBody;
  public currentState: AbstractEditorState = new EditorLockedState();
  public $isMount: boolean = false;

  constructor() {
    super();

    if (!window.isSecureContext) {
      console.warn(`markybox works only in https context.`);
    }

    const storage = this.storage = new EditorStorage();
    const display = this.display = new EditorDisplayController(storage);
    const navigator = this.navigator = new EditorBodyNavigator(display, storage, 'user');
    const body = this.body = new MHTMLEditorBody(display, navigator, storage, this);
    const controller = this.controller = new EditorRowsController(this, storage, body);

    this.selection = new EditorSelectionContainer(this, storage, display);
    this.clipboard = new UserClipboardController();
    this.navigatorManager = new EditorSimpleNavigator(controller, display, storage);
  }

  public unlock(): void {
    this.currentState = new EditorActiveState();
    this.currentState.setContext(this);
  }

  public lock(): void {
    this.currentState = new EditorLockedState();
    this.currentState.setContext(this);
  }

  public mount(selector: string): void {
    const { navigator, body } = this;
    const rootElement = document.querySelector<HTMLElement>(selector);

    if (!rootElement) {
      throw new CriticalError(`Element ${selector} not found.`);
    }

    this.body.mount(rootElement);
    this.display.mount(rootElement);

    const bodyElement = this.body.el;

    this.navigator.mount(bodyElement);
    this.selection.mount(bodyElement);

    this.unlock();

    this.body.addVisitor(new UserTextHintVisitor(navigator));
    this.body.addVisitor(new KeywordCheckerVisitor(body));

    this.registerListeners();

    this.$isMount = true;
  }

  public clear(): void {
    this.controller.clear();
    this.navigator.setPosition({ row: 0, column: 0 });
  }

  public getText(): string {
    const { rows } = this.storage;

    return rows.map((row) => row.toString()).join('\n');
  }

  public setText(text?: string): void {
    if (!text) {
      this.controller.addEmptyRow();
      return;
    }

    this.controller.setWholeText(text);
  }

  private registerListeners(): void {
    this.navigator.onDidUpdatePosition((position) => {
      const row = this.storage.at(position.row);

      if (!row) {
        throw new CriticalError(`Expected row at position: ${position.row}. Got undefined`);
      }

      this.controller.setCurrentRow(row);
    })

    // Select all code
    this.disposables.add(
      windowShortcut.registerShortcut('Meta+A', () => {
        this.selection.selectAll();
      })
    );

    this.disposables.add(
      windowShortcut.registerShortcut('Tab', (event) => {
        event.preventDefault();
        this.controller.addIndentToCurrentRow();
      })
    );

    this.disposables.add(
      windowShortcut.registerShortcut('Meta+Shift+Z', (event) => {
        event.preventDefault();

        console.log('Redo')
      })
    );

    this.disposables.add(
      windowShortcut.registerShortcut('Meta+Z', (event) => {
        event.preventDefault();

        console.log('Undo')
      })
    )

    this.disposables.add(
      windowShortcut.registerShortcut('Shift+Tab', (event) => {
        event.preventDefault();
        this.controller.removeIndentFromCurrentRow();
      })
    )

    // Copy all code
    this.disposables.add(
      windowShortcut.registerShortcut('Meta+C', () => {
        const text = this.selection.getSelectedText();

        void this.clipboard.write(text);
      })
    );

    // Paste all code from clipboard
    this.disposables.add(
      windowShortcut.registerShortcut('Meta+V', async () => {
        const text = await this.clipboard.read();

        this.controller.setWholeText(text);
      })
    );

    const onMousedown = (event: MouseEvent) => this.currentState.onClick(event);
    const onKeydown = (event: KeyboardEvent) => this.currentState.onKeyDown(event);

    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('keydown', onKeydown);

    this.disposables.add(toDisposable(() => window.removeEventListener('mousedown', onMousedown)));
    this.disposables.add(toDisposable(() => window.removeEventListener('keydown', onKeydown)));
  }

  public dispose(): void {
    super.dispose();
  }
}
