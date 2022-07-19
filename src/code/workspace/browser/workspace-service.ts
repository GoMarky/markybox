import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IWorkspaceService } from '@/code/workspace/common/workspace-service';

export interface IWorkspace {
  getFileContent(id: string): Promise<void>;
}

class Workspace extends Disposable implements IWorkspace {
  constructor() {
    super();
  }

  public async getFileContent(id: string): Promise<void> {
    console.log(id);
  }
}

export class WorkspaceService extends Disposable implements IWorkspaceService {
  constructor() {
    super();
  }

  public async createUntitledWorkspace(): Promise<void> {

  }
}
