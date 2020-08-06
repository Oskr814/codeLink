import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<User>(this.authUser());
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    async login(email: string, password: string) {
        this.http
            .post(`${environment.baseUrl}/login`, {
                email,
                password
            })
            .subscribe(
                (res: any) => {
                    if (res.ok) {
                        this.setToken(res.token)

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

    authUser(): User {
        let token = localStorage.getItem('token');      

        if (token) {
            const base64URL = token.split('.')[1];
            const base64 = base64URL.replace('-', '+').replace('_', '/');

            return JSON.parse(window.atob(base64)).data;
        }

        return null;
    }

    setToken(token) {
        localStorage.setItem('token', token);

        this.user$.next(this.authUser());
    }
}
