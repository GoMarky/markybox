import { ServiceCollection } from '@/platform/instantiation/browser/collection';
import { InstantiationService } from '@/platform/instantiation/browser/instantiation';
import { ConsoleLogService } from '@/platform/log/browser/log';
import { LogLevel } from '@/platform/log/common/abstractLog';
import { ILogService } from '@/platform/log/common/log';
import { ILifecycleService, LifecycleService } from '@/platform/lifecycle/browser/lifecycle';
import { isDev } from '@/base/platform';
import { EnvironmentService, IEnvironmentConfig } from '@/platform/environment/browser/environmentService';
import { IEnvironmentService } from '@/platform/environment/common/environment';

const services = new ServiceCollection();

// Instantiation service
new InstantiationService(services, true);

// Service for logging
const logService = new ConsoleLogService(LogLevel.Info);
services.set(ILogService, logService);

// Lifecycle hooks app-controller service
const lifecycleService = new LifecycleService(logService);
services.set(ILifecycleService, lifecycleService);

const environmentOptions: IEnvironmentConfig = {
  version: process.env.buildVersion as string,
  development: isDev,
};

// Environment service
const environmentService = new EnvironmentService(environmentOptions, logService, lifecycleService);
services.set(IEnvironmentService, environmentService);

export default services;
