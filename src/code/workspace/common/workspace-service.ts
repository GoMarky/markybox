import { createDecorator } from '@/platform/instantiation/common/instantiation';

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

export interface IWorkspaceService {
  createUntitledWorkspace(): Promise<void>;
}
