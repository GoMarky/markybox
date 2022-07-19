import { Disposable } from "@/platform/lifecycle/common/lifecycle";
import { Emitter, IEvent } from "@/base/event";

enum WorkspaceChannelCommand {
    FetchFile,
}

export interface IWorkspaceChannelResponse {
    type: WorkspaceChannelCommand;
    data: any;
  }

export class WorkspaceSocketChannel extends Disposable {
    private readonly _onMessage: Emitter<IWorkspaceChannelResponse> = new Emitter<IWorkspaceChannelResponse>();
    public readonly onMessage: IEvent<IWorkspaceChannelResponse> = this._onMessage.event;

    constructor(public readonly workspaceId: string) {
        super()
    }
}