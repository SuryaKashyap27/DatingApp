// import { inject } from '@angular/core';
// import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
// import { delay, finalize, of, tap } from 'rxjs';
// import { BusyService } from '../services/busy-service';
//   const cache = new Map<string, HttpEvent<unknown>>();
// export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
//   const busyService = inject(BusyService);


//   // Only cache GET requests
//   if (req.method === 'GET') {
//     const cachedResponse = cache.get(req.urlWithParams);

//     if (cachedResponse) {
//       return of(cachedResponse);
//     }
//   }
//   busyService.busy();

//   return next(req).pipe(
//     delay(500),
//      tap(event => {
//       if (req.method === 'GET' && event instanceof HttpResponse) {
//         cache.set(req.urlWithParams, event);
//       }
//     }),
//     finalize(() => busyService.idle())
//   );
// };


import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { delay, finalize, of, tap } from 'rxjs';
import { BusyService } from '../services/busy-service';

const cache = new Map<string, HttpEvent<unknown>>();

function generateCacheKey(url: string, params: HttpParams): string {
  const paramString = params.keys()
    .map(key => `${key}=${params.get(key)}`)
    .join('&');

  return paramString ? `${url}?${paramString}` : url;
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const cacheKey = generateCacheKey(req.url, req.params);

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(event => {
      if (req.method === 'GET' && event instanceof HttpResponse) {
        cache.set(cacheKey, event);
      }
    }),
    finalize(() => busyService.idle())
  );
};
