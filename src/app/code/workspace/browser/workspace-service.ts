import { Disposable } from '@/app/platform/lifecycle/common/lifecycle';
import { IWorkspaceService } from '@/app/code/workspace/common/workspace-service';
import { IWorkspaceFile } from '../common/workspace-file';
import { getMockFileTreeArray } from '../common/workspace-mocks';
import { SocketConnection } from '@/app/code/socket/browser/socket';
import { IWorkspaceSocketMessage, IWorkspaceSocketResponse, WorkspaceChannelCommand } from './workspace-socket-channel';
import { BASE_WEBSOCKET_URL } from '@/app/code/request/api';

export class Workspace extends Disposable {
  public readonly connection: SocketConnection<IWorkspaceSocketMessage, IWorkspaceSocketResponse>;

  public files: IWorkspaceFile[] = getMockFileTreeArray();

  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    super();

    const socketURL = `${BASE_WEBSOCKET_URL}/v1/workspace/${id}/`;

    this.connection = new SocketConnection(socketURL);
    this.connection.connect();
    this.registerListeners();
  }

  private registerListeners(): void {
    this.connection.onMessage((event) => console.log(event));
  }

  public requestFile(_: string): void {
    this.connection.send({
      type: WorkspaceChannelCommand.FetchFile,
    })
  }
}

export class WorkspaceService extends Disposable implements IWorkspaceService {
  private readonly workspaces: Map<string, Workspace> = new Map();

  constructor() {
    super();
  }

  public async createUntitledWorkspace(): Promise<void> {

  }

  public async loadWorkspacebyId(id: string): Promise<Workspace> {
    if (this.workspaces.has(id)) {
      return this.workspaces.get(id) as Workspace;
    }

    const workspaceName = '@gomarky/core';
    const workspace = new Workspace(id, workspaceName);
    this.workspaces.set(id, workspace);

    return workspace;
  }
}
