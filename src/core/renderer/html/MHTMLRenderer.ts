import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer } from '@/core/renderer/renderer';
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
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { MHTMLEditorActiveState } from '@/core/renderer/html/state/MHTMLEditorActiveState';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MHTMLEditorLockedState } from '@/core/renderer/html/state/MHTMLEditorLockedState';
import { CriticalError } from '@/base/errors';

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  public readonly display: HTMLDisplayRenderer;
  public readonly gutter: MHTMLEditorGutter;
  public readonly body: MHTMLEditorBody;
  public readonly textLayer: MTextLayer;
  public readonly markerLayer: MMarkerLayer;
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly selection: MHTMLEditorSelection;
  public readonly storage: MHTMLStorage;
  public currentState: MHTMLEditorState;

  private _currentRow: MHTMLGlyphRow;
  private readonly clipboard: MHTMLClipboard;

  constructor(public readonly root: HTMLElement) {
    super();

    // We use clipboard API, that only compactible with https.
    if (!window.isSecureContext) {
      throw new SecurityError(`markybox works only in security context. Please, enable HTTPS`);
    }

    this.storage = new MHTMLStorage();
    this.display = new HTMLDisplayRenderer(this);
    this.gutter = new MHTMLEditorGutter(this);
    this.body = new MHTMLEditorBody(this);
    this.selection = new MHTMLEditorSelection(this);
    this.navigator = new MHTMLEditorBodyNavigator(this, 'user');
    this.clipboard = new MHTMLClipboard();
    this.textLayer = new MTextLayer(this);
    this.markerLayer = new MMarkerLayer(this);
  }

  public get currentRow(): MHTMLGlyphRow {
    return this._currentRow;
  }

  public addEmptyRow(): MHTMLGlyphRow {
    const { rows } = this.storage;
    const row = new MHTMLGlyphRow(rows.length);
    this._currentRow = row;
    this.storage.addRow(row);

    this.textLayer.el.appendChild(row.el);

    return row;
  }

  public setCurrentRow(row: MHTMLGlyphRow): MHTMLGlyphRow {
    this._currentRow = row;

    return row;
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

    this.registerListeners();
    this.addEmptyRow();
  }

  private registerListeners(): void {
    window.addEventListener('click', (event) => this.currentState.onClick(event));
    window.addEventListener('keydown', (event) => this.currentState.onKeyDown(event));

    this.navigator.onDidUpdatePosition((position) => {
      const row = this.storage.at(position.row);

      if (!row) {
        throw new CriticalError(`Row at - ${position.row} doesn't exist`);
      }

      this.setCurrentRow(row);
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
        const text = await this.clipboard.read();

        console.log(text);
      })
    );
  }
}
