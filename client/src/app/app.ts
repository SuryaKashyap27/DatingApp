import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { User } from '../types/types';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
private accountService = inject(AccountService);

protected router = inject(Router);
setCurrentUser(){
  const userString=localStorage.getItem('user');
  if (!userString) return;
   const user = JSON.parse(userString);

    this.accountService.currentUser.set(user);
}
  private http=inject(HttpClient);

  protected members=signal<User[]>([]);
  protected readonly title = signal('Dating App');
//---------------------------------------
  // ngOnInit(): void {
  //   this.http.get('https://localhost:5001/api/members')
  //   .subscribe(
  //     {
  //       next:response => this.members.set(response),
  //       error:error=> console.log(error),
  //       complete:()=>console.log('Request completed')
  //     }
  //   )
  //     }
 async ngOnInit()
 {
  this.members.set(await this.getMembers());
  this.setCurrentUser();
 }

  //---------------------------------------

      async getMembers()
      {
        try {
             return   await  firstValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));

        }
        catch (error) {
          console.log(error);
          throw error;
        }
      }
}
