import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { SidebarService } from '../../services/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    user: User;
    logoUrl = 'assets/images/logo-dark.png';
    actualRoute: string = '';

    constructor(
        private _authService: AuthService,
        private _sidebarService: SidebarService,
        private router: Router
    ) {
        _authService.user$.subscribe((user) => {
            this.user = user;
        });

        this.router.events.subscribe((event: NavigationEnd) => {
            if (event.url) {
                this.actualRoute = event.url;
            }
        });
    }

    ngOnInit(): void {}

    toggleSidebar() {
        this._sidebarService.toggleSidebar();
    }

    logOut() {
        this._authService.logOut();
    }
}
