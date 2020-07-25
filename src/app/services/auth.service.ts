import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLogin = new BehaviorSubject<Boolean>(this.hasToken());
    user$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    constructor(private router: Router) {}

    async signIn(email: string, password: string) {
        //Probar credenciales

        const user = {
            name: 'Oscar Eduardo Blandon',
            email,
            photoURL: 'assets/images/profile.png'
        };

        this.user$.next(user);

        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['home']);
    }

    logOut() {
        localStorage.removeItem('user');
        this.user$.next(null);

        this.router.navigate(['/']);
    }

    hasToken(): Boolean {
        return !!localStorage.getItem('user');
    }
}
