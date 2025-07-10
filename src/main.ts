import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';  // Importa AppModule

platformBrowserDynamic()
  .bootstrapModule(AppModule)  // Usa el AppModule para bootstrap
  .catch(err => console.error(err));
