import { BaseObject } from '@/core/objects/BaseObject';
import { Emitter, IEvent } from '@/base/event';
import { Note } from '@/code/notes/common/notes';
import { HTMLRenderer } from '@/core';
import { debounce } from '@/base/async';

export enum AutoSave {
  Timeout,
  Always,
  OnChange,
  Disabled
}

const SAVE_TIMEOUT = 500;

export class EditorAutoSaveController extends BaseObject {
  private readonly _onDidSave: Emitter<Note.NoteContent> = new Emitter<Note.NoteContent>();
  public readonly onDidSave: IEvent<Note.NoteContent> = this._onDidSave.event;

  public type: AutoSave = AutoSave.Always;

  constructor(private readonly renderer: HTMLRenderer) {
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

    this.renderer.logger?.info(`Document saved.`);

    if (this.type === AutoSave.Always) {
      this._onDidSave.fire(text);
    }
  }, SAVE_TIMEOUT)
}
