import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { EditorLang, MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLClipboard } from '@/core/renderer/html/system/MHTMLClipboard';
import { MHTMLEditorSelection } from '@/core/renderer/html/editor/MHTMLEditorSelection';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLEditorActiveState } from '@/core/renderer/html/state/MHTMLEditorActiveState';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MHTMLEditorLockedState } from '@/core/renderer/html/state/MHTMLEditorLockedState';
import { CriticalError } from '@/base/errors';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { IAbstractRenderer } from '@/core/app/renderer';
import { MHTMLTextHintVisitor } from '@/core/renderer/html/visitors/MHTMLTextHintVisitor';
import { MHTMLHighlightKeywordVisitor } from '@/core/renderer/html/visitors/MHTMLHighlightKeywordVisitor';
import { ILogger } from '@/core/app/common';
import { MHTMLEditorNavigators } from '@/core/renderer/html/editor/MHTMLEditorNavigators';
import { SecurityError } from '@/core/app/errors';

interface IMHTMLRendererConstructorOptions {
  readonly root: HTMLElement;
  readonly lang: EditorLang;
  readonly author: string;
}

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  public logger?: ILogger;
  public readonly root: HTMLElement;

  public readonly display: MHTMLDisplayRenderer;
  public readonly body: MHTMLEditorBody;
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly selection: MHTMLEditorSelection;
  public readonly storage: MHTMLStorage;
  public readonly controller: MHTMLEditorController;
  public readonly navigatorManager: MHTMLEditorNavigators;

  public currentState: MHTMLEditorState;

  private readonly clipboard: MHTMLClipboard;

  constructor(options: IMHTMLRendererConstructorOptions) {
    super();

    if (!window.isSecureContext) {
      throw new SecurityError(`markybox works only in security context. Please, enable HTTPS`);
    }

    const { root, lang, author } = options;
    this.root = root;

    const storage = this.storage = new MHTMLStorage();
    const body = this.body = new MHTMLEditorBody(this, lang);
    const navigator = this.navigator = new MHTMLEditorBodyNavigator(this, author);

    this.selection = new MHTMLEditorSelection(this);
    this.display = new MHTMLDisplayRenderer(root, body.el, storage, navigator);
    this.clipboard = new MHTMLClipboard();
    this.controller = new MHTMLEditorController(this);
    this.navigatorManager = new MHTMLEditorNavigators(this);
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

  public unlock(): void {
    this.currentState = new MHTMLEditorActiveState();
    this.currentState.setContext(this);
  }

  public lock(): void {
    this.currentState = new MHTMLEditorLockedState();
    this.currentState.setContext(this);
  }

  public init(logger?: ILogger): void {
    this.logger = logger;

    this.unlock();

    this.body.addVisitor(new MHTMLTextHintVisitor(this));
    this.body.addVisitor(new MHTMLHighlightKeywordVisitor(this));

    this.registerListeners();
  }

  public clear(): void {
    this.controller.clear();
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
}
