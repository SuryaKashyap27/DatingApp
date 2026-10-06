import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/types';
import { tap } from 'rxjs/internal/operators/tap';

@Service()
export class AccountService {
   
    currentUser=signal<User | null>(null);

    private http=inject(HttpClient);
    baseUrl = 'https://localhost:5001/api/';
    login(creds: any) {
        return this.http.post<User>(this.baseUrl+'account/login', creds).pipe(
            tap(user =>{this.setCurrentUser(user)

                // if (user) {
                //     localStorage.setItem('user', JSON.stringify(user));
                //     this.currentUser.set(user);
                // }
            })

        );
    }

    setCurrentUser(user: User) {

    localStorage.setItem('user', JSON.stringify(user));

    this.currentUser.set(user);}

    register(creds: RegisterCreds) {

    return this.http.post<User>(
        this.baseUrl + 'accounts/register',
        creds
    ).pipe(
        tap(user => this.setCurrentUser(user))
    );

}
    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }
}
