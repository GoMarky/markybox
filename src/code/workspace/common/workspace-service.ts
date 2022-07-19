import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { IWorkspace } from '../browser/workspace-service';

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

export interface IWorkspaceService {
  loadWorkspacebyId(id: string): Promise<IWorkspace>;
  createUntitledWorkspace(): Promise<void>;
}
