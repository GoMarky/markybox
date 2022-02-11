import { createApp } from 'vue';
import appServices from '@/constructors';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';
import { ILogService } from '@/platform/log/common/log';
import { ICreateComponentFactory } from '@/base/platform';
import { ServiceCollection } from '@/platform/instantiation/browser/collection';
import { getSingletonServiceDescriptors } from '@/platform/instantiation/browser/singleton';
import router from '@/views/router/router';

class Application {
  public init(services: ServiceCollection): void {
    return this.createServices(services);
  }

  public createServices(services: ServiceCollection): void {
    const singletons = getSingletonServiceDescriptors();
    const instantiationService = services.get(IInstantiationService);

    // Make sure to add all services that use `registerSingleton`
    for (const [id, descriptor] of singletons) {
      instantiationService.createInstance2(descriptor, id);
    }

    void this.createView(services);
  }

  public async createView(services: ServiceCollection): Promise<void> {
    const logService = services.get(ILogService);

    const App = (await import('@/views/App.vue')).default;

    logService.info(`Create view`);
    createApp(App).use(router).mount('#app')
  }
}

function main() {
  const instantiationService = appServices.get(IInstantiationService);

  const workbench: ICreateComponentFactory = {
    createComponent(fn, ...args) {
      return instantiationService.invokeFunction(fn, ...args);
    },
  };

  window.workbench = workbench;

  const app = new Application();

  app.init(appServices);
}

main();
