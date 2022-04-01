import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { HTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorGutter } from '@/core/renderer/html/editor/MHTMLEditorGutter';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLClipboard } from '@/core/renderer/html/system/MHTMLClipboard';
import { SecurityError } from '@/core/app/errors';
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
import { MHTMLTextIndentVisitor } from '@/core/renderer/html/visitors/MHTMLTextIndentVisitor';
import { MHTMLHighlightKeywordVisitor } from '@/core/renderer/html/visitors/MHTMLHighlightKeywordVisitor';
import { MPartitionLayer } from '@/core/renderer/html/layers/MPartionLayer';

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  public readonly display: HTMLDisplayRenderer;
  public readonly gutter: MHTMLEditorGutter;
  public readonly body: MHTMLEditorBody;
  public readonly textLayer: MTextLayer;
  public readonly markerLayer: MMarkerLayer;
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly selection: MHTMLEditorSelection;
  public readonly storage: MHTMLStorage;
  public readonly controller: MHTMLEditorController;
  public currentState: MHTMLEditorState;

  private readonly clipboard: MHTMLClipboard;
  private readonly partitionLayer: MPartitionLayer;

  constructor(public readonly root: HTMLElement, author: string = 'user') {
    super();

    if (!window.isSecureContext) {
      throw new SecurityError(`markybox works only in security context. Please, enable HTTPS`);
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
  }

  public unlock(): void {
    this.currentState = new MHTMLEditorActiveState();
    this.currentState.setContext(this);
  }

  public lock(): void {
    this.currentState = new MHTMLEditorLockedState();
    this.currentState.setContext(this);
  }

  public init(text?: string): void {
    this.unlock();

    this.body.addVisitor(new MHTMLTextHintVisitor());
    this.body.addVisitor(new MHTMLTextIndentVisitor(this));
    this.body.addVisitor(new MHTMLHighlightKeywordVisitor());

    this.registerListeners();

    if (text) {
      this.controller.setWholeText(text);
    } else {
      this.controller.addEmptyRow();
    }
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
        await this.clipboard.read();
      })
    );

    window.addEventListener('mousedown', (event) => this.currentState.onClick(event));
    window.addEventListener('keydown', (event) => this.currentState.onKeyDown(event));
  }
}
