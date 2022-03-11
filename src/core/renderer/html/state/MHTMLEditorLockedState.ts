import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';

export class MHTMLEditorLockedState extends MHTMLEditorState {
  constructor() {
    super();
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
}
