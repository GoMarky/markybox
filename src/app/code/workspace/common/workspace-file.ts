export enum FileType {
  Directory,
  File,
}

export function isDirectory(type: FileType): boolean {
  return type === FileType.Directory;
}

export function isFile(type: FileType): boolean {
  return type === FileType.File
}

export interface IRawWorkspaceFile {
  readonly id: string;
  readonly name: string;
  readonly type: FileType;
  readonly parentId: string | null;
}

export interface IWorkspaceFile extends IRawWorkspaceFile {
  readonly children?: IWorkspaceFile[];
}

export namespace FileExtension {
  export function isJavascript(path: string): boolean {
    return path.endsWith('.js');
  }
  export function isJSON(path: string): boolean {
    return path.endsWith('.json');
  }
}