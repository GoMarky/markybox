import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { HTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorGutter } from '@/core/renderer/html/editor/MHTMLEditorGutter';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLClipboard } from '@/core/renderer/html/system/MHTMLClipboard';
import { MHTMLEditorSelection } from '@/core/renderer/html/editor/MHTMLEditorSelection';
import { MMarkerLayer } from '@/core/renderer/html/layers/MMarkerLayer';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLEditorActiveState } from '@/core/renderer/html/state/MHTMLEditorActiveState';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MHTMLEditorLockedState } from '@/core/renderer/html/state/MHTMLEditorLockedState';
import { CriticalError } from '@/base/errors';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { IAbstractRenderer } from '@/core/app/renderer';
import { MHTMLTextHintVisitor } from '@/core/renderer/html/visitors/MHTMLTextHintVisitor';
import { MHTMLHighlightKeywordVisitor } from '@/core/renderer/html/visitors/MHTMLHighlightKeywordVisitor';
import { MPartitionLayer } from '@/core/renderer/html/layers/MPartionLayer';
import { MEditorAutoSave } from '@/core/objects/MEditorAutoSave';
import { ILogger } from '@/core/app/common';

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  public logger?: ILogger;
  public readonly display: HTMLDisplayRenderer;
  public readonly gutter: MHTMLEditorGutter;
  public readonly body: MHTMLEditorBody;
  public readonly textLayer: MTextLayer;
  public readonly markerLayer: MMarkerLayer;
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly selection: MHTMLEditorSelection;
  public readonly storage: MHTMLStorage;
  public readonly controller: MHTMLEditorController;
  public readonly editorAutoSave: MEditorAutoSave
  public currentState: MHTMLEditorState;

  private readonly clipboard: MHTMLClipboard;
  private readonly partitionLayer: MPartitionLayer;

  private navigators: MHTMLEditorBodyNavigator[] = [];

  constructor(public readonly root: HTMLElement, author: string = 'user') {
    super();

    if (!window.isSecureContext) {
      console.warn(`markybox works only in security context. Please, enable HTTPS`);
    }

    this.storage = new MHTMLStorage();
    this.display = new HTMLDisplayRenderer(this);
    this.gutter = new MHTMLEditorGutter(this);
    this.body = new MHTMLEditorBody(this);
    this.selection = new MHTMLEditorSelection(this);
    this.navigator = new MHTMLEditorBodyNavigator(this, author);
    this.clipboard = new MHTMLClipboard();
    this.textLayer = new MTextLayer(this);
    this.markerLayer = new MMarkerLayer(this);
    this.partitionLayer = new MPartitionLayer(this);
    this.controller = new MHTMLEditorController(this);
    this.editorAutoSave = new MEditorAutoSave(this);
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
      windowShortcut.registerShortcut('Tab!', () => {
        this.controller.addIndentToCurrentRow();
      })
    );

    this.disposables.add(
      windowShortcut.registerShortcut('Shift+Tab', () => {

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

  public init(logger: ILogger): void {
    this.logger = logger;

    this.unlock();

    this.body.addVisitor(new MHTMLTextHintVisitor(this));
    this.body.addVisitor(new MHTMLHighlightKeywordVisitor());

    this.registerListeners();
  }

  public getText(): string {
    const { rows } = this.storage;

    return rows.map((row) => row.toString()).join('\n');
  }

  public setText(text: string): void {
    if (!text) {
      this.controller.addEmptyRow();
      return;
    }

    this.controller.setWholeText(text);
  }

  public addNavigator(name: string): void {
    const navigator = new MHTMLEditorBodyNavigator(this, name);

    this.navigators.push(navigator);
  }

  public removeNavigator(name: string): void {
    const navigator = this.navigators.find((nav => nav.name === name));

    if (!navigator) {
      throw new CriticalError(`Can find navigator with name - ${name}`);
    }

    navigator.dispose();
    this.navigators = this.navigators.filter((nav) => nav !== navigator);
  }
}
