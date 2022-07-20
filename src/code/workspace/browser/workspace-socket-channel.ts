export enum WorkspaceChannelCommand {
    FetchFile = 'fetch_file'
}

export interface IWorkspaceSocketMessage {
    type: WorkspaceChannelCommand;
}

export interface IWorkspaceSocketResponse {
    
}
