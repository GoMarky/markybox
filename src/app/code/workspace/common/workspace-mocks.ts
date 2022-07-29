import { FileType, IWorkspaceFile, IRawWorkspaceFile } from '@/app/code/workspace/common/workspace-file';
import { nanoid } from 'nanoid';
import { isUndefinedOrNull } from '@/base/types';

const rootId = nanoid(5);

const RAW_FILES: IRawWorkspaceFile[] = [
  {
    id: rootId,
    parentId: null,
    type: FileType.Directory,
    name: 'Root',
  },
  {
    id: nanoid(5),
    parentId: rootId,
    type: FileType.File,
    name: 'main.js',
  },
  {
    id: nanoid(5),
    parentId: rootId,
    type: FileType.File,
    name: 'index.js',
  },
  {
    id: nanoid(5),
    parentId: rootId,
    type: FileType.File,
    name: 'package.json',
  },
  {
    id: nanoid(5),
    parentId: rootId,
    type: FileType.File,
    name: '.editorconfig',
  }
];

function isRootFile(file: IRawWorkspaceFile): boolean {
  return isUndefinedOrNull(file.parentId);
}

function isNotRootFile(file: IRawWorkspaceFile): boolean {
  return !isUndefinedOrNull(file.parentId);
}

export function getMockFileTreeArray(): IWorkspaceFile[] {
  const files: Map<string, IWorkspaceFile> = new Map();

  for (const file of RAW_FILES) {
    if (isRootFile(file)) {
      files.set(file.id, {
        id: file.id,
        name: file.name,
        parentId: file.parentId,
        type: file.type,
        children: [],
      });
    }

    if (isNotRootFile(file)) {
      const folder = files.get(file.parentId as string) as IWorkspaceFile;

      folder.children?.push({
        id: file.id,
        name: file.name,
        parentId: file.parentId,
        type: file.type,
      })
    }
  }

  return Array.from(files.values());
}
