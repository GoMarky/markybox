import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';

export class MHTMLEditorLockedState extends MHTMLEditorState {
  constructor() {
    super();
  }

  public onInput(letter: string): void {
    console.log(letter);
  }

  public onClick(event: MouseEvent): void {
    console.log(event);
  }

  public onKeyDown(event: KeyboardEvent): void {
    console.log(event);
  }
}
