import { CanActivateFn } from '@angular/router';
import { AccountService } from '../account-service';
import { inject } from '@angular/core';
import { ToastService } from '../toast';

export const authGuard: CanActivateFn = (route, state) => {
    const accountService = inject(AccountService);
    const toast = inject(ToastService);
    if(accountService.currentUser())
    {
      return true;

    }
  
      toast.error('You shall not pass!');

  return false;
};
