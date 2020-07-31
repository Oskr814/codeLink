import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
    constructor(private _authService: AuthService, private router: Router) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const user: any = this._authService.authUser();

        if (user) {
            this.router.navigate(['/home']);
        }

        return true;
    }
}
