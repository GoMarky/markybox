import { AbstractEditorState } from '@/core/renderer/html/state/AbstractEditorState';

export class EditorLockedState extends AbstractEditorState {
  constructor() {
    super();
  }

  public onDoubleClick(_: MouseEvent) {
  }

  public onKeyUp(_: KeyboardEvent) {
  }

  public onInput(_: string): void {
    //
  }

  public onClick(_: MouseEvent): void {
    //
  }

  public onKeyDown(_: KeyboardEvent): void {
    //
  }

  public onSelectionEnd(_: MouseEvent): void {
  }

  public onSelectionMove(_: MouseEvent): void {
  }

  public onSelectionStart(_: MouseEvent): void {
  }
}
