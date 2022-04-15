import { MObject } from '@/core/objects/MObject';
import { Emitter, IEvent } from '@/base/event';

export enum AutoSave {
  Timeout,
  Always,
  OnChange,
  Disabled
}

export class MEditorAutoSave extends MObject {
  private readonly _onDidAutoSaved: Emitter<void> = new Emitter<void>();
  public readonly onDidAutoSaved: IEvent<void> = this._onDidAutoSaved.event;

  public type: AutoSave = AutoSave.Disabled;

  constructor() {
    super();
  }

  public save(): void {

  }
}
