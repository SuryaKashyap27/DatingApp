import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast';
import { themes } from '../themes';
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


    
protected selectedTheme = signal<string>(
  localStorage.getItem('theme') ?? 'light'
);

protected themes = themes;

ngOnInit(): void {
  document.documentElement.setAttribute(
    'data-theme',
    this.selectedTheme()
  );
}

protected handleSelectTheme(theme: string): void {
  this.selectedTheme.set(theme);

  localStorage.setItem('theme', theme);

  document.documentElement.setAttribute(
    'data-theme',
    theme
  );

  const activeElement = document.activeElement as HTMLElement | null;
  activeElement?.blur();
}

}
