import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError(error => {

      switch (error.status) {

        case 400:

          if (error.error.errors) {

            const modelStateErrors: string[] = [];

            for (const key in error.error.errors) {

              if (error.error.errors[key]) {
                modelStateErrors.push(...error.error.errors[key]);
              }

            }

            throw modelStateErrors.flat();

          } else {

            toast.error(error.error);

          }

          break;

        case 401:
          // 401 handling
          toast.error('Unauthorized');

          break;

        case 404:
          // 404 handling
          router.navigateByUrl('/not-found');
          break;

        case 500:

          const navigationExtras = {
            state: {
              error: error.error
            }
          };

          router.navigateByUrl('/server-error', navigationExtras);

          break;
        default:
          // unknown error
          toast.error('Something went wrong');
          break;
      }
      throw error;
    })
  );

};
