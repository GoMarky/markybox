import windowShortcut from '@gomarky/window-shortcut';
import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererBody, IRendererDisplay, IRendererGutter } from '@/core/renderer/renderer';
import { Char } from '@/base/char';
import { MRow } from '@/core/objects/MRow';
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
import { getLastLetter } from '@/base/string';
import { JavascriptKeyword } from '@/core/formatters/common';

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
  public readonly navigator: MHTMLEditorBodyNavigator;
  public readonly selection: MHTMLEditorSelection;

  private navigators: MHTMLEditorBodyNavigator[] = [];

  public editor: MEditor;
  private readonly clipboard: MHTMLClipboard;

  constructor(public readonly root: HTMLElement) {
    super();

    // We use clipboard API, that only compactible with https.
    if (!window.isSecureContext) {
      throw new SecurityError(`markybox works only in security context. Please, enable HTTPS`);
    }

    this.display = new HTMLDisplayRenderer(this);
    this.gutter = new MHTMLEditorGutter(this);
    this.body = new MHTMLEditorBody(this);
    this.selection = new MHTMLEditorSelection(this);
    this.navigator = new MHTMLEditorBodyNavigator(this, 'user');
    this.clipboard = new MHTMLClipboard();
    this.textLayer = new MTextLayer(this);

    this.registerListeners();
  }

  private onClick(event: MouseEvent): void {
    const { clientX, clientY } = event;
    const position = this.toEditorPosition({ top: clientY, left: clientX });
    const row = this.editor.getRowByPosition(position.row);

    if (row) {
      this.navigator.setPosition({ row: position.row, column: 0 });
    }
  }

  private onSpecialKeyDown(event: KeyboardEvent): void {
    const code = event.code as Char;

    const { rowsCount } = this.editor;
    const { position: { row } } = this.navigator;

    switch (code) {
      case Char.ArrowLeft:
        return this.navigator.prevColumn();
      case Char.ArrowRight:
        return this.navigator.nextColumn();
      case Char.ArrowUp: {
        return this.navigator.setPosition({ row: row - 1, column: 0 })
      }
      case Char.ArrowDown: {
        const isCurrentPositionHasLastRow = (row + 1) === rowsCount;

        if (isCurrentPositionHasLastRow) {
          const { index } = this.editor.addEmptyRow();
          return this.navigator.setPosition({ row: index, column: 0 })
        }

        return this.navigator.nextRow();
      }
      case Char.Backspace:
        this.navigator.prevColumn();
        return this.body.removeLastLetterFromCurrentRow();
      case Char.Enter: {
        const currentRow = this.editor.getCurrentRow();
        const lastLetter = getLastLetter(currentRow.content.text.trim());
        const newRow = this.editor.addEmptyRow();

        if (lastLetter === '{') {
          newRow.content.setContentWithFormat([{
            keyword: JavascriptKeyword.Plain,
            className: 'm-editor__plain',
            data: '}'
          }]);
        }

        this.navigator.nextRow();
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

  public onAddRow(row: MRow): void {
    this.gutter.onAddRow(row);
  }
}
