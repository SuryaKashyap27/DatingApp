import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast';
@Component({
  imports: [FormsModule, RouterLink, RouterLinkActive],
  selector: 'app-nav',
  styleUrl: './nav.css',
  templateUrl: './nav.html',
})
export class Nav {
 protected accountService = inject(AccountService);
//  protected loggedin=signal(false);
private router = inject(Router);
private toastService = inject(ToastService);
    protected creds: any = {};
    login()
    {
        this.accountService.login(this.creds).subscribe({
            next: result => {
                console.log(result);
                // this.loggedin.set(true);
                this.creds = {};
                  this.router.navigateByUrl('/members');
                  this.toastService.success("Logged in successfully");},
            
            error: (error) => {
            //    alert(error.message);
            console.log(error);
              this.toastService.error(error.message);
            }
        });
    }
    logout()
    {
      // this.loggedin.set(false);
      this.accountService.logout();
         this.router.navigateByUrl('/');
         this.toastService.success("Logged Out");
    }

}
