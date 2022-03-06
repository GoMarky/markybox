import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererBody, IRendererDisplay, IRendererGutter } from '@/core/renderer/renderer';
import { Char } from '@/base/char';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { IPosition } from '@/core/renderer/common';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { HTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorGutter } from '@/core/renderer/html/editor/MHTMLEditorGutter';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { IDOMPosition } from '@/core/renderer/html/common/helpers';
import { MEditor } from '@/core';
import { MHTMLClipboard } from '@/core/renderer/html/system/MHTMLClipboard';
import { SecurityError } from '@/core/app/errors';
import { MHTMLEditorSelection } from '@/core/renderer/html/editor/MHTMLEditorSelection';
import { MMarkerLayer } from '@/core/renderer/html/layers/MMarkerLayer';
import { ICodeFormatter } from '@/core/formatters/common';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { MGlyph } from '@/core/objects/MGlyph';

// TODO: do not use clientX

const EDITOR_OFFSET_POSITION: IDOMPosition = {
  top: 35,
  left: 40,
}

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  public readonly display: IRendererDisplay;
  public readonly gutter: IRendererGutter;
  public readonly body: IRendererBody;
  public readonly textLayer: MTextLayer;
  public readonly markerLayer: MMarkerLayer;
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly selection: MHTMLEditorSelection;
  public readonly storage: MHTMLStorage;

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

    this.registerListeners();
    this.addEmptyRow();
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

  private onClick(event: MouseEvent): void {
    const { clientX, clientY } = event;
    const position = this.toEditorPosition({ top: clientY, left: clientX });
    const row = this.storage.at(position.row);

    if (row) {
      const domPosition = this.toDOMPosition(position);
      this.markerLayer.setTopPosition(domPosition.top)
      this.navigator.setPosition({ row: position.row, column: 0 });
    }
  }

  private onSpecialKeyDown(event: KeyboardEvent): void {
    const code = event.code as Char;

    const rowsCount = this.storage.count;
    const { position: { row } } = this.navigator;

    switch (code) {
      case Char.ArrowLeft:
        return this.navigator.prevColumn();
      case Char.ArrowRight:
        return this.navigator.nextColumn();
      case Char.ArrowUp: {
        const domPosition = this.toDOMPosition({ row: row - 1, column: 0 });
        this.markerLayer.setTopPosition(domPosition.top);
        return this.navigator.setPosition({ row: row - 1, column: 0 })
      }
      case Char.ArrowDown: {
        const isCurrentPositionHasLastRow = (row + 1) === rowsCount;

        if (isCurrentPositionHasLastRow) {
          const { index } = this.addEmptyRow();
          const domPosition = this.toDOMPosition({ row: index, column: 0 });
          this.markerLayer.setTopPosition(domPosition.top);
          return this.navigator.setPosition({ row: index, column: 0 })
        }


        return this.navigator.nextRow();
      }
      case Char.Backspace:
        this.navigator.prevColumn();
        return this.body.removeLastLetterFromCurrentRow();
      case Char.Enter: {
        const newRow = this.addEmptyRow();

        this.navigator.nextRow();
        const domPosition = this.toDOMPosition({ row: newRow.index, column: 0 });
        this.markerLayer.setTopPosition(domPosition.top);
        return this.navigator.setPosition({ row: newRow.index, column: 0 })
      }
    }
  }

  private registerListeners(): void {
    window.addEventListener('click', this.onClick.bind(this));
    window.addEventListener('keydown', this.onSpecialKeyDown.bind(this));

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

  public toDOMPosition(position: IPosition): IDOMPosition {
    const { row, column } = position;

    return {
      top: row * 16,
      left: column * 7.2,
    }
  }

  public toEditorPosition(position: IDOMPosition): IPosition {
    let { top, left } = position;

    top -= EDITOR_OFFSET_POSITION.top;
    left -= EDITOR_OFFSET_POSITION.left;

    return {
      row: Math.round(top / 16),
      column: Math.round(left / 7.2),
    }
  }
}
