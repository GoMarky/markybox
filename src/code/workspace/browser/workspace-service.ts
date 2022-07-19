import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IWorkspaceService } from '@/code/workspace/common/workspace-service';
import { IWorkspaceFile } from '../common/workspace-file';
import { getMockFileTreeArray } from '../common/workspace-mocks';
import { WorkspaceSocketChannel } from './workspace-socket-channel';

export interface IWorkspace {
  readonly id: string;
  readonly channel: WorkspaceSocketChannel;

  files: IWorkspaceFile[];

  requestFile(_: string): void;
}

class Workspace extends Disposable implements IWorkspace {
  public readonly channel: WorkspaceSocketChannel;

  public files: IWorkspaceFile[] = getMockFileTreeArray();

  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    super();

    this.channel = new WorkspaceSocketChannel(id);
    
    this.registerListeners();
  }
  
  private registerListeners(): void {
    this.channel.onMessage((event) => console.log(event));
  }

  public requestFile(_: string): void {
    return;
  }
}

export class WorkspaceService extends Disposable implements IWorkspaceService {
  private readonly workspaces: Map<string, IWorkspace> = new Map();

  constructor() {
    super();
  }

  public async createUntitledWorkspace(): Promise<void> {

  }

  public async loadWorkspacebyId(id: string): Promise<IWorkspace> {
    if (this.workspaces.has(id)) {
      return this.workspaces.get(id) as IWorkspace;
    }

    const workspaceName = '@gomarky/core';
    const workspace = new Workspace(id, workspaceName);
    this.workspaces.set(id, workspace);

    return workspace;
  }
}
