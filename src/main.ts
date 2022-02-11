import { createApp } from 'vue';
import App from '@/views/App.vue';

class Application {
  public init(): void {
    createApp(App).mount('#app');
  }
}

function main() {
  const app = new Application();

  app.init();
}

main();
