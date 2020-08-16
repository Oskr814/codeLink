import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from './toastr.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<User>(this.authUser());
    constructor(
        private router: Router,
        private http: HttpClient,
        private _toastrService: ToastrService
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
                        this.setToken(res.token);

                        this.user$.next(res.user);

                        this.router.navigate(['home']);
                    }
                },
                (err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
            );
    }

    logOut() {
        localStorage.removeItem('token');
        this.user$.next(null);

        this.router.navigate(['/']);
    }

    async changePassword(data) {
        const user = this.authUser();

        return await this.http
            .post(`${environment.baseUrl}/change-password/${user._id}`, data)
            .toPromise();
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
