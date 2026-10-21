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
  HttpResponse
} from '@angular/common/http';
import { delay, finalize, of, tap } from 'rxjs';
import { BusyService } from '../services/busy-service';

const cache = new Map<string, HttpEvent<unknown>>();

const invalidateCache = (urlPattern: string) => {
  for (const key of cache.keys()) {
    if (key.includes(urlPattern)) {
      cache.delete(key);
      console.log('Cache invalidated for:', key);
    }
  }
};

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  const cacheKey = req.urlWithParams;

  // Invalidate cached like-related GET responses after a like/unlike POST.
  if (req.method === 'POST' && req.url.includes('/likes')) {
    invalidateCache('/likes');
  }
  // Invalidate cached message-related GET responses
  if (req.method === 'POST' && req.url.includes('/messages')) {
  invalidateCache('/messages');
}

  // Return cached GET responses without setting the busy state.
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
