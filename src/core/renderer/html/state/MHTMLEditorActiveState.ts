import { Char } from '@/base/char';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLEditorActiveState extends MHTMLEditorState {
  constructor() {
    super();
  }

  public onInput(letter: string): void {
    const { currentRow, navigator } = this.renderer;
    const { position: { column, row } } = navigator;

    const glyph = currentRow.getGlyphByColumn(column) as MHTMLGlyphWord;

    if (glyph) {
      glyph.text += letter;
    } else {
      const textGlyph = new MHTMLGlyphWord(column, column + 1);
      currentRow.insert(textGlyph);
      textGlyph.text = letter;
    }

    navigator.setPosition({ row, column: column + 1 });
  }

  public onClick(event: MouseEvent): void {
    const { display, storage, navigator } = this.renderer;

    const { clientX, clientY } = event;
    const position = display.toEditorPosition({ top: clientY, left: clientX });
    const row = storage.at(position.row);

    if (row) {
      navigator.setPosition({ row: position.row, column: 0 });
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    const { storage, navigator, body } = this.renderer;
    const code = event.code as Char;

    const rowsCount = storage.count;
    const { position: { row } } = navigator;

    switch (code) {
      case Char.ArrowLeft:
        return navigator.prevColumn();
      case Char.ArrowRight:
        return navigator.nextColumn();
      case Char.ArrowUp: {
        return navigator.setPosition({ row: row - 1, column: 0 })
      }
      case Char.ArrowDown: {
        const isCurrentPositionHasLastRow = (row + 1) === rowsCount;

        if (isCurrentPositionHasLastRow) {
          const { index } = this.renderer.addEmptyRow();
          return navigator.setPosition({ row: index, column: 0 })
        }


        return navigator.nextRow();
      }
      case Char.Backspace:
        navigator.prevColumn();
        return;
      case Char.Enter: {
        const newRow = this.renderer.addEmptyRow();
        navigator.nextRow();
        return navigator.setPosition({ row: newRow.index, column: 0 })
      }
    }
  }
}
