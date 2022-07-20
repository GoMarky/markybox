import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Workspace } from '../browser/workspace-service';

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

export interface IWorkspaceService {
  loadWorkspacebyId(id: string): Promise<Workspace>;
  createUntitledWorkspace(): Promise<void>;
}
