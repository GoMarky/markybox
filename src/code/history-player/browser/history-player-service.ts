import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IHistoryPlayerService } from '@/code/history-player/common/history-player';

export class HistoryPlayerService extends Disposable implements IHistoryPlayerService {
  constructor() {
    super();
  }
}
