import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<User>(this.userAuth());
    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private jwtHelper: JwtHelperService
    ) {}

    async login(email: string, password: string) {
        this.httpClient
            .post('http://localhost:3000/login', {
                email,
                password
            })
            .subscribe(
                (res: any) => {
                    if (res.ok) {
                        localStorage.setItem('token', res.token);

                        this.user$.next(res.user);

                        this.router.navigate(['home']);
                    }
                },
                (err) => console.log(err.error.message)
            );
    }

    logOut() {
        localStorage.removeItem('token');
        this.user$.next(null);

        this.router.navigate(['/']);
    }

    userAuth(): User {
        let token = localStorage.getItem('token');

        if (token) {
            const base64URL = token.split('.')[1];
            const base64 = base64URL.replace('-', '+').replace('_', '/');

            return JSON.parse(window.atob(base64)).data;
        }

        return null;
    }
}
