
import { provideRouter, withViewTransitions } from '@angular/router';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject
} from '@angular/core';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InitService } from '../core/services/init';
import { lastValueFrom } from 'rxjs';
import { jwtInterceptor } from '../core/interceptors/jwt-interceptor';
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withViewTransitions()),
    provideHttpClient(withInterceptors([jwtInterceptor,    loadingInterceptor,errorInterceptor])),


    provideAppInitializer(async () => {

  const initService = inject(InitService);

  await lastValueFrom(initService.init());
  await new Promise(resolve => setTimeout(resolve, 500));

  const splash = document.getElementById('initial-splash');

  if (splash) {
    splash.remove();
  }

})
  ]
};
