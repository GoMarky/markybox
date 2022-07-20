import { ServiceCollection } from '@/platform/instantiation/browser/collection';
import { InstantiationService } from '@/platform/instantiation/browser/instantiation';
import { ConsoleLogService } from '@/platform/log/browser/log';
import { LogLevel } from '@/platform/log/common/abstractLog';
import { ILogService } from '@/platform/log/common/log';
import { ILifecycleService, LifecycleService } from '@/platform/lifecycle/browser/lifecycle';
import { EnvironmentService, IEnvironmentConfig } from '@/platform/environment/browser/environmentService';
import { IEnvironmentService } from '@/platform/environment/common/environment';
import { RequestService } from '@/platform/request/browser/requestService';
import { IRequestService } from '@/platform/request/common/requestService';
import { SessionService } from '@/code/session/browser/sessionService';
import { ISessionService } from '@/code/session/common/session';
import { LayoutService } from '@/platform/layout/browser/layout-service';
import { ILayoutService } from '@/platform/layout/common/layout';
import { NoteService } from '@/code/notes/browser/note-service';
import { INoteService } from '@/code/notes/common/notes';
import { WorkspaceService } from '@/code/workspace/browser/workspace-service';
import { IWorkspaceService } from '@/code/workspace/common/workspace-service';

const services = new ServiceCollection();

// Instantiation service
const instantiationService = new InstantiationService(services, true);

// Service for logging
const logService = new ConsoleLogService(LogLevel.Info);
services.set(ILogService, logService);

// Lifecycle hooks app-controller service
const lifecycleService = new LifecycleService(logService);
services.set(ILifecycleService, lifecycleService);

const environmentOptions: IEnvironmentConfig = {
  version: '0.0.1',
};

// Environment service
const environmentService = new EnvironmentService(environmentOptions);
services.set(IEnvironmentService, environmentService);

// layout
const layoutService = new LayoutService();
services.set(ILayoutService, layoutService);

// request
const requestService = new RequestService(logService, lifecycleService, instantiationService);
services.set(IRequestService, requestService);

// session
const sessionService = new SessionService(requestService)
services.set(ISessionService, sessionService);

// note
const noteService = new NoteService(requestService, sessionService);
services.set(INoteService, noteService);

// workspace
const workspaceService = new WorkspaceService();
services.set(IWorkspaceService, workspaceService);

export default services;
