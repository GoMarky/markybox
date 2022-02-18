import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererBody, IRendererDisplay, IRendererGutter } from '@/core/renderer/renderer';
import { Char } from '@/base/char';
import { MRow } from '@/core/objects/MRow';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { MCaretLayer } from '@/core/renderer/html/layers/MCaretLayer';
import { IPosition } from '@/core/renderer/common';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { HTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorGutter } from '@/core/renderer/html/editor/MHTMLEditorGutter';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { IDOMPosition } from '@/core/renderer/html/common/helpers';
import { WindowLocalShortcut } from '@/core/extensions/window-local-shortcut/window-local-shortcut';
import { MEditor } from '@/core';

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  public readonly display: IRendererDisplay;
  public readonly gutter: IRendererGutter;
  public readonly body: IRendererBody;
  public readonly textLayer: MTextLayer;
  public readonly caretLayer: MCaretLayer;
  public readonly navigator: MHTMLEditorBodyNavigator;

  public editor: MEditor;
  private readonly shortcuts: WindowLocalShortcut;

  constructor(public readonly root: HTMLElement) {
    super();
    this.shortcuts = new WindowLocalShortcut();
    this.display = new HTMLDisplayRenderer(this);
    this.gutter = new MHTMLEditorGutter(this);
    this.body = new MHTMLEditorBody(this);
    this.navigator = new MHTMLEditorBodyNavigator(this);

    this.textLayer = new MTextLayer(this);
    this.caretLayer = new MCaretLayer(this);

    this.registerShortcuts();
    this.activateSpecialKeysHandler();
  }

  private onSpecialKeyDown = (event: KeyboardEvent) => {
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
        const { index } = this.editor.addEmptyRow();
        this.navigator.nextRow();
        return this.navigator.setPosition({ row: index, column: 0 })
      }
    }
  }

  private registerShortcuts(): void {
    this.shortcuts.registerShortcut('Meta+A', () => {
      console.log(this.editor.rows);
    })
  }

  private activateSpecialKeysHandler() {
    window.addEventListener('keydown', this.onSpecialKeyDown)
  }

  public toDOMPosition(position: IPosition): IDOMPosition {
    const { row, column } = position;

    return {
      top: row * 16,
      left: column * 7.2,
    }
  }

  public onAddRow(row: MRow): void {
    this.gutter.onAddRow(row);
  }
}
