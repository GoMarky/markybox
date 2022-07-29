import { Disposable } from '@/app/platform/lifecycle/common/lifecycle';
import { IHistoryPlayerService } from '@/app/code/history-player/common/history-player';

export class HistoryPlayerService extends Disposable implements IHistoryPlayerService {
  constructor() {
    super();
  }
}
