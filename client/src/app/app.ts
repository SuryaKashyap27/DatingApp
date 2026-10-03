import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http=inject(HttpClient);

  protected members=signal<any>([]);
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
 }

  //---------------------------------------

      async getMembers()
      {
        try {
             return   await  firstValueFrom(this.http.get('https://localhost:5001/api/members'));

        }
        catch (error) {
          console.log(error);
          throw error;
        }
      }
}
