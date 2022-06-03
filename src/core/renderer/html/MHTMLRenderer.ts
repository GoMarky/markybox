import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLClipboard } from '@/core/renderer/html/system/MHTMLClipboard';
import { MHTMLEditorSelection } from '@/core/renderer/html/editor/MHTMLEditorSelection';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLEditorActiveState } from '@/core/renderer/html/state/MHTMLEditorActiveState';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MHTMLEditorLockedState } from '@/core/renderer/html/state/MHTMLEditorLockedState';
import { CriticalError } from '@/base/errors';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { MHTMLTextHintVisitor } from '@/core/renderer/html/visitors/MHTMLTextHintVisitor';
import { MHTMLHighlightKeywordVisitor } from '@/core/renderer/html/visitors/MHTMLHighlightKeywordVisitor';
import { MHTMLEditorNavigators } from '@/core/renderer/html/editor/MHTMLEditorNavigators';
import { IAbstractRenderer } from '@/core/app/renderer';

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  private readonly selection: MHTMLEditorSelection;
  private readonly storage: MHTMLStorage;
  private readonly clipboard: MHTMLClipboard;

  public readonly navigatorManager: MHTMLEditorNavigators;
  public readonly display: MHTMLDisplayRenderer;
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly controller: MHTMLEditorController;
  public readonly body: MHTMLEditorBody;
  public currentState: MHTMLEditorState;

  constructor() {
    super();

    if (!window.isSecureContext) {
      console.warn(`markybox works only in https context.`);
    }

    const storage = this.storage = new MHTMLStorage();
    const display = this.display = new MHTMLDisplayRenderer(storage);
    const navigator = this.navigator = new MHTMLEditorBodyNavigator(display, storage, 'user');
    const body = this.body = new MHTMLEditorBody(display, navigator, this);
    const controller = this.controller = new MHTMLEditorController(this, storage, body);


    this.selection = new MHTMLEditorSelection(this, storage, display);
    this.clipboard = new MHTMLClipboard();
    this.navigatorManager = new MHTMLEditorNavigators(controller, display, storage);
  }

  public unlock(): void {
    this.currentState = new MHTMLEditorActiveState();
    this.currentState.setContext(this);
  }

  public lock(): void {
    this.currentState = new MHTMLEditorLockedState();
    this.currentState.setContext(this);
  }

  public init(): void {
    this.unlock();

    this.body.addVisitor(new MHTMLTextHintVisitor(this));
    this.body.addVisitor(new MHTMLHighlightKeywordVisitor(this));

    this.registerListeners();
  }

  public mount(selector: string): void {
    const rootElement = document.querySelector<HTMLElement>(selector);

    if (!rootElement) {
      throw new CriticalError(`Element ${selector} not found.`);
    }

    this.body.mount(rootElement);
    this.display.mount(rootElement);

    const bodyElement = this.body.el;

    this.navigator.mount(bodyElement);
    this.selection.mount(bodyElement);

    this.display.setFullScreen();

    this.init();
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

    window.addEventListener('mousedown', (event) => this.currentState.onClick(event));
    window.addEventListener('keydown', (event) => this.currentState.onKeyDown(event));
  }
}
