import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IWorkspaceService } from '@/code/workspace/common/workspace-service';

export class WorkspaceService extends Disposable implements IWorkspaceService {
  constructor() {
    super();
  }

  public async createUntitledWorkspace(): Promise<void> {

  }
}
