import { MObject } from '@/core/objects/MObject';
import { Emitter, IEvent } from '@/base/event';
import { Note } from '@/code/notes/common/notes';
import { MHTMLRenderer } from '@/core';
import { debounce } from '@/base/async';

export enum AutoSave {
  Timeout,
  Always,
  OnChange,
  Disabled
}

const SAVE_TIMEOUT = 500;

export class MEditorAutoSave extends MObject {
  private readonly _onDidSave: Emitter<Note.NoteContent> = new Emitter<Note.NoteContent>();
  public readonly onDidSave: IEvent<Note.NoteContent> = this._onDidSave.event;

  public type: AutoSave = AutoSave.Always;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public save(): void {
    if (this.type === AutoSave.Disabled) {
      return;
    }

    return this.doSave();
  }

  private doSave = debounce(() => {
    const text = this.renderer.getText();

    if (this.type === AutoSave.Always) {
      this._onDidSave.fire(text);
    }
  }, SAVE_TIMEOUT)
}
