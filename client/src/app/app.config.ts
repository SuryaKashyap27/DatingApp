
import { provideRouter, withViewTransitions } from '@angular/router';

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject
} from '@angular/core';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InitService } from '../core/services/init';
import { lastValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withViewTransitions()),
    provideHttpClient(),


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
