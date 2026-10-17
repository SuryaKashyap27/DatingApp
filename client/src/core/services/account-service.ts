import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { LikesService } from './likes-service';

@Service()
export class AccountService {

    currentUser = signal<User | null>(null);
    private likesService = inject(LikesService);
    private http = inject(HttpClient);
    baseUrl = 'https://localhost:5001/api/';
    login(creds: any) {
        return this.http.post<User>(this.baseUrl + 'accounts/login', creds).pipe(
            tap(user => {
                this.setCurrentUser(user)

                // if (user) {
                //     localStorage.setItem('user', JSON.stringify(user));
                //     this.currentUser.set(user);
                // }
            })

        );
    }

    setCurrentUser(user: User) {

        localStorage.setItem('user', JSON.stringify(user));

        this.currentUser.set(user);

        this.likesService.getLikeIds();
    }

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
        localStorage.removeItem('filters');
        this.currentUser.set(null);
         this.likesService.clearLikeIds();
    }
}
