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
import { ICodeFormatter } from '@/core/formatters/common';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { MHTMLEditorActiveState } from '@/core/renderer/html/state/MHTMLEditorActiveState';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';

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

  private navigators: MHTMLEditorBodyNavigator[] = [];
  private _currentRow: MHTMLGlyphRow;

  private readonly clipboard: MHTMLClipboard;
  private readonly _currentFormatter: ICodeFormatter;

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

    this._currentFormatter = new JavascriptCodeFormatter();
  }

  public get formatter(): ICodeFormatter {
    return this._currentFormatter;
  }

  public addEmptyRow(): MHTMLGlyphRow {
    const { rows } = this.storage;
    const { el } = this.textLayer
    const row = new MHTMLGlyphRow(el, rows.length);

    this._currentRow = row;

    this.storage.addRow(row);

    return row;
  }

  public getCurrentRow(): MHTMLGlyphRow {
    return this._currentRow;
  }

  private registerListeners(): void {
    window.addEventListener('click', (event) => this.currentState.onClick(event));
    window.addEventListener('keydown', (event) => this.currentState.onKeyDown(event));

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

  public setCurrentRow(row: MHTMLGlyphRow): MHTMLGlyphRow {
    this._currentRow = row;

    return row;
  }

  public addNavigator(name: string): void {
    const navigator = new MHTMLEditorBodyNavigator(this, name);

    this.navigators.push(navigator);
  }

  public removeNavigator(name: string): void {
    console.log(name);
  }

  public init(): void {
    this.currentState = new MHTMLEditorActiveState();
    this.currentState.setContext(this);

    this.registerListeners();
    this.addEmptyRow();
  }
}
