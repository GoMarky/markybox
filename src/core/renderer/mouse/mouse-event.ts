import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { EventEmitter } from '@/base/event-emitter';

export class EditorMouseEvent extends Disposable{
  constructor(
    private readonly domEvent: MouseEvent,
  ) {
    super();
  }
}
